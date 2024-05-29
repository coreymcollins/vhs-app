import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';
import { getUserCollection } from '@/app/actions';

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
        context: 'collection-public',
        username
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