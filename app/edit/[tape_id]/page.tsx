import sql from '@/app/components/database'
import { EditForm } from '@/app/components/edit-tape';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { checkForAdmin } from '@/app/actions/sign-in';
import { createClient } from '@/utils/supabase/server';

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre_names: string[];
    year: number;
    date_added: string;
    date_updated: string;
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
    const supabase = createClient()

    const { data: tape, error } = await supabase.rpc( 'get_tape_by_tape_id', { tapeidquery: tape_id });

    // console.log( 'tape', tape[0] )

    // console.log( 'tape genres', tape[0].genres )

    if (error) {
        console.error(`Error searching for tape by tape ID: ${tape_id}`)
        throw error
    }

    // tape[0]['genre_names'] = tape[0].genres.join( ', ' )

    // console.log( 'tape genres after', tape[0].genre_names )
    // console.log( 'tape after', tape[0] )

    return (
        <>
            <h2>Edit existing tape</h2>
            <EditForm tape={tape[0]}/>
        </>
    )

    // const session = await getServerSession( options )

    // if ( ! session || undefined !== session.user && !( await checkForAdmin( session.user.name ?? '' ) ) ) {
    //     redirect( `/api/auth/signin?callbackUrl=/edit/${tape_id}` )
    // }

    // try {
    //     const tapes = await sql`
    //     SELECT tapes.tape_id,
    //         tapes.barcode,
    //         tapes.title,
    //         tapes.description,
    //         tapes.year,
    //         tapes.coverfront,
    //         tapes.date_added,
    //         tapes.date_updated,
    //         STRING_AGG(genres.genre_name, ', ') AS genre_names
    //     FROM tapes
    //     LEFT JOIN tapes_genres ON tapes.tape_id = tapes_genres.tape_id
    //     LEFT JOIN genres ON tapes_genres.genre_id = genres.genre_id
    //     WHERE tapes.tape_id=${ tape_id }
    //     GROUP BY tapes.tape_id, tapes.barcode, tapes.title, tapes.description, tapes.year, tapes.coverfront
    //     ORDER BY tapes.tape_id;
    //     `;

    //     tapes.length > 0 ? tapes.map(row => serializeResult(row)) : null;
    //     const tape = tapes[0];

    //     console.log( tape )
        
    //     return (
    //         <>
    //             <h2>Edit existing tape</h2>
    //             <EditForm tape={tape}/>
    //         </>
    //     )
    // } catch (error) {
    //     console.error(`Database search failed: ${error}`);
    //     throw new Error('Failed to search for the item in the database');
    // }
}