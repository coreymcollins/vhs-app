import postgres from 'postgres'
import { AddForm } from './components/add-form'

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
    ssl: 'allow',
});

export default async function Home() {
    let tapes = await sql`SELECT * FROM tapes`
    
    return (
        <main>
            <h1>Add a new tape</h1>
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
                        <td key={`${tape.barcode}-${tape.coverfront}`}>
                            { tape.coverfront ? (
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