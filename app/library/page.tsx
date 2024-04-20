import sql from '../components/database';
import { SearchResultTable } from '../components/table-search-result'

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre: string;
    year: number;
    coverfront: Buffer | null;
}

export default async function LibraryPage() {
    let tapes: Tape[] = []

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
            LEFT JOIN tapes_genres ON tapes.tape_id = tapes_genres.tape_id
            LEFT JOIN genres ON tapes_genres.genre_id = genres.genre_id
            GROUP BY tapes.tape_id, tapes.barcode, tapes.title, tapes.description, tapes.year, tapes.coverfront
            ORDER BY tapes.tape_id;
        `;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
    
    return (
        <>
            <h2>Full Library</h2>
            <SearchResultTable tapes={tapes} />
        </>
    )
}