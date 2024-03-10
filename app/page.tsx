import postgres from 'postgres'
import { AddForm } from './components/add-form'
import { SearchForm } from './components/search-form';
import sql from './components/database';

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
                    <tr key={`${tape.barcode}-table-row`}>
                        <td key={`${tape.barcode}-${tape.id}`}>
                            {tape.id}
                        </td>
                        <td key={tape.barcode}>
                            {tape.barcode}
                        </td>
                        <td key={`${tape.barcode}-${tape.title}`}>
                            {tape.title}
                        </td>
                        <td key={`${tape.barcode}-${tape.description}`}>
                            {tape.description}
                        </td>
                        <td key={`${tape.barcode}-${tape.genre}`}>
                            {tape.genre}
                        </td>
                        <td key={`${tape.barcode}-${tape.year}`}>
                            {tape.year}
                        </td>
                        <td key={`${tape.barcode}-coverfront`}>
                            { tape.coverfront && tape.coverfront.length > 0 ? (
                                <img src={`data:image/jpeg;base64,${tape.coverfront.toString('base64')}`} alt={`${tape.title} front cover`} className="cover-front" />

                            ) : (
                                <>No image available</>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    )
}