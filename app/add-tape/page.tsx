import Link from 'next/link'
import { AddForm } from '../components/add-tape'

export default async function AddTapePage() {
    
    return (
        <main>
            <h1><Link href="/">VHS Library</Link></h1>

            <h2>Add new tape</h2>
            <AddForm />
        </main>
    )
}