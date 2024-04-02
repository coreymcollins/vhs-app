import { AddForm } from './components/add-tape'
import { SearchForm } from './components/search-form'
import sql from './components/database'
import { BarcodeScanQuagga } from './components/search-form-scan-quagga'
import { AddUser } from './components/add-user'
import LoginForm from './components/login-form'
import { SearchResultTable } from './components/table-search-result'

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre: string;
    year: number;
    coverfront: Buffer | null;
}

export default async function Home() {
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
        <main>
            <h1>VHS Library</h1>

            <h2>Edit an existing tape</h2>

            <h2>Search for an existing tape</h2>
            <SearchForm />

            <h2>Search for an existing tape by barcode</h2>
            <BarcodeScanQuagga />

            <h2>Add new tape</h2>
            <AddForm />

            <h2>Current library</h2>

            <SearchResultTable tapes={tapes} />
        </main>
    )
}