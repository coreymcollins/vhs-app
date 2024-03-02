import postgres from 'postgres'
import { AddForm } from './components/add-form'

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
    ssl: 'allow',
});

export default async function Home() {
    let tapes = await sql`SELECT * FROM tapes`
    
    return (
        <main>
            <h1>These are my tapes</h1>
            <AddForm />
            <ul>
                {tapes.map(( tape ) => (
                    <li key={tape.title}>
                        {tape.title}
                    </li>
                ))}
            </ul>
            <h2>Barcodes for testing</h2>
            <ul>
                <li>Spice Girls: 085393635534</li>
                <li>Thirsty Dead: 062896013809</li>
                <li>Little Bigfoot: 017153840735</li>
                <li>Great American Bash: 028485107526</li>
                <li>I'm Gonna Git You Sucka: 027616164131</li>
            </ul>
        </main>
    )
}