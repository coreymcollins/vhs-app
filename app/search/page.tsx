import { SearchForm } from '@/app/components/search-form'
import PageHeader from '../components/header'

export default async function SearchPage() {
    
    return (
        <main>
            <PageHeader />

            <h2>Search for an existing tape</h2>
            <SearchForm />
        </main>
    )
}