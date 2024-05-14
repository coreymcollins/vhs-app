import { SearchForm } from '@/app/components/search-form'
import { checkLoginStatus } from '../actions/check-login-status'

export default async function SearchPage( req: any ) {
    const userAuth = await checkLoginStatus()
    
    return (
        <>
            <h2>Search for an existing tape</h2>
            <SearchForm session={userAuth} req={req} />
        </>
    )
}