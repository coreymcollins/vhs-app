import { createClient } from '@/utils/supabase/server';
import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';

export async function generateMetadata( req: any) {
    const username = req.params.username

    if ( ! username ) {
        return {
            title: 'Revival Video',
            description: 'Be kind. Revive.',
        }
    }

    return {
        title: `Revival Video: Collection of ${username}`,
        description: `View the Revival Video Collection of ${username}`,
    }
}

async function getUserCollection( username: string ) {

    if ( null === username ) {
        return { error: 'Username cannot be null' }
    }

    const supabase = createClient()

    const { data: user, error: userError } = await supabase
        .from( 'users' )
        .select( 'uuid' )
        .eq( 'username', username )
        .maybeSingle()
    
    if ( userError ) {
        console.error( 'Error fetching user:', userError.message );
        return { error: `Error fetching user: ${userError.message}`} 
    }

    if ( null === user ) {
        console.error( 'Username does not exist.' );
        return { error: 'Username does not exist'} 
    }

    const { data: tapes, error: tapesError } = await supabase.rpc('get_tapes_by_user_id', { useridquery: user.uuid });

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return {tapes};
}

export default async function LibraryPage( req: any ) {
    const username = req.params.username
    const {tapes, error} = await getUserCollection( username )

    if ( error ) {
        return (
            <div className="page-content-header">
                <h2>{`${error}`}</h2>
            </div>
        )
    }

    if ( ! tapes ) {
        return (
            <div className="page-content-header">
                <h2>{`Viewing Collection of ${username} failed: no tapes found`}</h2>
            </div>
        )
    }

    const userAuth = await checkLoginStatus()
    const totalTapes = tapes.length
    let { page } = req.searchParams
    page = undefined === page ? 1 : page

    const props = {
        tapes,
        session: userAuth,
        pageNumber: page,
        context: 'collection'
    }

    return (
        <>
            <div className="page-content-header">
                <h2>
                    {error ? `Error: ${error}` : `Viewing Collection of ${username} (${totalTapes})`}
                </h2>
            </div>
            { null !== tapes && <WithPagination {...props} /> }
        </>
    )
}