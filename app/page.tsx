import { AddForm } from './components/add-form'
import { SearchForm } from './components/search-form';
import sql from './components/database';
import { SingleTapeRow } from './components/single-tape-row';

interface Tape {
    id: number;
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
        tapes = await sql`SELECT * FROM tapes`;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
    
    return (
        <main>
            <h1>VHS Library</h1>

            <h2>Search for an existing tape</h2>
            <SearchForm />

            <h2>Add new tape</h2>
            <AddForm />

            <h2>Current library</h2>

            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Barcode</td>
                        <td>Title</td>
                        <td>Description</td>
                        <td>Genre</td>
                        <td>Release Year</td>
                        <td>Front Cover</td>
                    </tr>
                </thead>
                <tbody>
                    {tapes.map(( tape ) => (
                        <SingleTapeRow key={`listing-${tape.id}`} tape={tape} context="listing" />
                    ))}
                </tbody>
            </table>
        </main>
    )
}