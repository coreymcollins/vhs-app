import { createClient } from '@/utils/supabase/server';
import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';
import { getUsernameByUuid } from '../actions';
import CopyCollectionUrl from '@/app/components/button-copy-collection-url';

async function getUsersTapes() {
    const supabase = createClient()
    const user = await checkLoginStatus()

    if ( null === user ) {
        return []
    }

    const { data, error } = await supabase.rpc('get_tapes_by_user_id', { useridquery: user.id });
    
    if (error) {
        console.error('Error fetching tapes in collection:', error.message);
        return null;
    }

    return data;
}

export default async function LibraryPage( req: any ) {
    const tapes = await getUsersTapes()
    const userAuth = await checkLoginStatus()
    const username = await getUsernameByUuid( userAuth.id )
    
    const totalTapes = tapes.length
    let { page } = req.searchParams
    page = undefined === page ? 1 : page

    return (
        <>
            <div className="page-content-header">
                <h2>My Library ({totalTapes})</h2>
                <CopyCollectionUrl username={username} />
            </div>
            
            { null !== tapes && <WithPagination tapes={tapes} session={userAuth} pageNumber={page} /> }
        </>
    )
}