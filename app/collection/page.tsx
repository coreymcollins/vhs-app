import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';
import { getUsernameByUuid, getUsersTapesByUuid } from '../actions';
import CopyCollectionUrl from '@/app/components/button-copy-collection-url';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Revival Video: My Collection',
    description: 'View your Revival Video Collection.',
};

export default async function LibraryPage( req: any ) {
    const userAuth = await checkLoginStatus()

    if ( ! userAuth ) {
        return
    }
    
    const username = await getUsernameByUuid( userAuth.id )
    const tapes = await getUsersTapesByUuid( userAuth.id )
    
    const totalTapes = tapes.length
    let { page } = req.searchParams
    page = undefined === page ? 1 : page

    const props = {
        tapes,
        session: userAuth,
        pageNumber: page,
        context: 'collection',
        username: ''
    }

    return (
        <>
            <div className="page-content-header">
                <h2>My Collection ({totalTapes})</h2>
                <CopyCollectionUrl username={username} />
            </div>
            
            { null !== tapes && <WithPagination {...props} /> }
        </>
    )
}