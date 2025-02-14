import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';
import { getUsersTapesByUuid } from '@/app/queries/getUsersTapesByUuid';
import { getUsernameByUuid } from '@/app/queries/getUsernameByUuid';
import CopyCollectionUrl from '@/app/components/button-copy-collection-url';
import { Metadata } from 'next';
import MultiSelectFilters from '../components/multi-select-filters';
import { getTapesByQueryArgs } from '../queries/getTapesByQueryArgs';

export const metadata: Metadata = {
    title: 'Revival Video: My Collection',
    description: 'View your Revival Video Collection.',
};

export default async function LibraryPage( {searchParams}: {searchParams: {genre?: string; distributor?: string; page?: number}} ) {
    const userAuth = await checkLoginStatus()

    if ( ! userAuth ) {
        return
    }
    
    let tapes = await getUsersTapesByUuid( userAuth.id )
    tapes = await getTapesByQueryArgs( tapes, searchParams )
    const username = await getUsernameByUuid( userAuth.id )
    let page = searchParams?.page
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
                <h2>My Collection ({tapes?.length || 0})</h2>
                <CopyCollectionUrl username={username} />
                <MultiSelectFilters />
            </div>
            
            { null !== tapes && <WithPagination {...props} /> }
        </>
    )
}
