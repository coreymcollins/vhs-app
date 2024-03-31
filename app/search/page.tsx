import { SearchForm } from '@/app/components/search-form'

export default async function SearchPage() {
    
    return (
        <main>
            <h1>VHS Library</h1>

            <h2>Search for an existing tape</h2>
            <SearchForm />
        </main>
    )
}