import { createClient } from '@/utils/supabase/client';
import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';
import { PaginationProps } from '../components/types';
import { Metadata } from 'next';
import MultiSelectFilters from '../components/multi-select-filters';
import { getTapesByQueryArgs } from '@/app/queries/getTapesByQueryArgs';

export const metadata: Metadata = {
    title: 'Revival Video: Library',
    description: 'View the full Revival Video Library.',
};

async function getTapesWithGenres() {
    const supabase = createClient()    

    const { data, error } = await supabase
        .from('tapes')
        .select('*')
        .order('title_lower', { ascending: true })

    if ( error ) {
        console.error( 'Error fetching tapes in library:', error.message );
        return null;
    }

    return data;
}

export default async function LibraryPage( {searchParams}: {searchParams: {genre?: string; distributor?: string; page?: number}} ) {
    let tapes = await getTapesWithGenres()
    tapes = await getTapesByQueryArgs( tapes, searchParams )

    if ( null === tapes ) {
        return
    }
    
    const session = await checkLoginStatus()
    const totalTapes = tapes.length
    let page = searchParams?.page
    page = undefined === page ? 1 : page

    const paginationProps: PaginationProps = {
        tapes,
        session,
        pageNumber: page,
        context: 'library'
    }
    
    return (
        <>
            <div className="page-content-header">
                <h2>Full Library ({ totalTapes })</h2>
                <MultiSelectFilters />
            </div>
            <WithPagination {...paginationProps} />
        </>
    )
}