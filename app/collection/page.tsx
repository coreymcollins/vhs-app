import { getServerSession } from 'next-auth';
import sql from '../components/database';
import { SearchResultTable } from '../components/table-search-result'
import { getCurrentUserId } from '../actions/sign-in';
import { options } from '../api/auth/[...nextauth]/options';

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre: string;
    year: number;
    coverfront: Buffer | null;
}

export default async function CollectionPage() {
    let tapes: Tape[] = []
    let userId: number
    
    const session = await getServerSession( options )

    if ( session && session.user ) {
        userId = await getCurrentUserId( session.user.name ?? '' )
    } else {
        userId = 0
    }

    try {
        tapes = await sql`
            SELECT tapes.tape_id,
                tapes.barcode,
                tapes.title,
                tapes.description,
                tapes.year,
                tapes.coverfront,
                STRING_AGG(genres.genre_name, ', ') AS genre_names
            FROM tapes
            INNER JOIN users_tapes ON tapes.tape_id = users_tapes.tape_ids
            LEFT JOIN tapes_genres ON tapes.tape_id = tapes_genres.tape_id
            LEFT JOIN genres ON tapes_genres.genre_id = genres.genre_id
            WHERE users_tapes.user_id = ${userId}
            GROUP BY tapes.tape_id, tapes.barcode, tapes.title, tapes.description, tapes.year, tapes.coverfront
            ORDER BY tapes.tape_id;
        `;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
    
    return (
        <>
            <h2>My Library</h2>
            <SearchResultTable tapes={tapes} session={session} />
        </>
    )
}