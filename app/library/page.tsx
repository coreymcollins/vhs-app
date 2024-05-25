import { createClient } from '@/utils/supabase/client';
import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';
import { PaginationProps } from '../components/types';

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
    const session = await checkLoginStatus()
    const totalTapes = tapes.length
    let { page } = req.searchParams
    page = undefined === page ? 1 : page

    const paginationProps: PaginationProps = {
        tapes,
        session,
        pageNumber: page
    }
    
    return (
        <>
            <div className="page-content-header">
                <h2>Full Library ({ totalTapes })</h2>
            </div>
            <WithPagination {...paginationProps} />
        </>
    )
}

