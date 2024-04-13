import { SearchForm } from '@/app/components/search-form'
import Link from 'next/link'

export default async function SearchPage() {
    
    return (
        <main>
            <h1><Link href="/">VHS Library</Link></h1>

            <h2>Search for an existing tape</h2>
            <SearchForm />
        </main>
    )
}