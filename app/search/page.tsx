import { SearchForm } from '@/app/components/search-form'
import { getServerSession } from 'next-auth'
import { options } from '../api/auth/[...nextauth]/options'

export default async function SearchPage() {
    const session = await getServerSession( options )
    
    return (
        <>
            <h2>Search for an existing tape</h2>
            <SearchForm session={session} />
        </>
    )
}