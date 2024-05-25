import { createClient } from '@/utils/supabase/server';
import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';

async function getUsersTapes( username: string ) {

    if ( null === username ) {
        return
    }
    
    const supabase = createClient()

    const { data: user, error: userError } = await supabase
        .from( 'users' )
        .select( 'uuid' )
        .eq( 'username', username )
        .maybeSingle()
    
    if ( userError ) {
        console.error( 'Error fetching user:', userError.message );

        return null;
    }

    if ( null === user ) {
        console.error( 'Error fetching user.' );

        return null;
    }

    const { data: tapes, error: tapesError } = await supabase.rpc('get_tapes_by_user_id', { useridquery: user.uuid });

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        
        return null;
    }

    return tapes;
}

export default async function LibraryPage( req: any ) {
    const username = req.params.username

    if ( null === username ) {
        return
    }

    const tapes = await getUsersTapes( username )
    const userAuth = await checkLoginStatus()
    const totalTapes = tapes.length
    let { page } = req.searchParams
    page = undefined === page ? 1 : page

    return (
        <>
            <div className="page-content-header">
                <h2>Viewing Library of {username} ({totalTapes})</h2>
            </div>
            { null !== tapes && <WithPagination tapes={tapes} session={userAuth} pageNumber={page} /> }
        </>
    )
}