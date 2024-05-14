import { createClient } from '@/utils/supabase/client';
import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';

async function getTapesWithGenres() {
    const supabase = createClient()    
    
    const { data, error } = await supabase.rpc('get_tapes_with_genres');

    if ( error ) {
        console.error( 'Error fetching tapes in library:', error.message );
        return null;
    }
    return data;
}

export default async function LibraryPage( req: any ) {
    const tapes = await getTapesWithGenres()
    const userAuth = await checkLoginStatus()
    let { page } = req.searchParams
    page = undefined === page ? 1 : page
    
    return (
        <>
            <h2>Full Library</h2>
            <WithPagination tapes={tapes} session={userAuth} pageNumber={page} />
        </>
    )
}

