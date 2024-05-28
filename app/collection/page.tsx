import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';
import { getUsernameByUuid, getUsersTapesByUuid } from '../actions';
import CopyCollectionUrl from '@/app/components/button-copy-collection-url';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Revival Video: My Collection',
    description: 'Be kind. Revive.',
};

export default async function LibraryPage( req: any ) {
    const userAuth = await checkLoginStatus()
    const username = await getUsernameByUuid( userAuth.id )
    const tapes = await getUsersTapesByUuid( userAuth.id )
    
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