import sql from '@/app/components/database'
import { EditForm } from '@/app/components/edit-tape';
import PageHeader from '@/app/components/header';
import Link from 'next/link'

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre: string;
    year: number;
    coverfront: Buffer | null;
}

function serializeResult(result: any) {
    if (result.coverfront instanceof Uint8Array) {
        result.coverfront = Buffer.from(result.coverfront).toString('base64')
    }

    return result;
}

export default async function EditTapePage( { params }: { params: { tape_id: number } } ) {
    const {tape_id} = params

    try {
        const tapes = await sql`
        SELECT tapes.tape_id,
            tapes.barcode,
            tapes.title,
            tapes.description,
            tapes.year,
            tapes.coverfront,
            STRING_AGG(genres.genre_name, ', ') AS genre_names
        FROM tapes
        LEFT JOIN tapes_genres ON tapes.tape_id = tapes_genres.tape_id
        LEFT JOIN genres ON tapes_genres.genre_id = genres.genre_id
        WHERE tapes.tape_id=${ tape_id }
        GROUP BY tapes.tape_id, tapes.barcode, tapes.title, tapes.description, tapes.year, tapes.coverfront
        ORDER BY tapes.tape_id;
        `;

        tapes.length > 0 ? tapes.map(row => serializeResult(row)) : null;
        const tape = tapes[0];
        
        return (
            <main>
                <PageHeader />
    
                <h2>Edit existing tape</h2>
                <EditForm tape={tape}/>
            </main>
        )
    } catch (error) {
        console.error(`Database search failed: ${error}`);
        throw new Error('Failed to search for the item in the database');
    }
}