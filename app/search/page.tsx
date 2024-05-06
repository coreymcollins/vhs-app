import { SearchForm } from '@/app/components/search-form'
import { getCurrentUserSupabaseAuth } from '../actions'

export default async function SearchPage() {
    const userAuth = await getCurrentUserSupabaseAuth()
    
    return (
        <>
            <h2>Search for an existing tape</h2>
            <SearchForm session={userAuth} />
        </>
    )
}