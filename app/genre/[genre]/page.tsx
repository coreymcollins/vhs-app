import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';
import { PaginationProps } from '@/app/components/types';
import { Metadata } from 'next';
import { getGenreNameBySlug, getTapesByGenre } from '@/app/actions';

export const metadata: Metadata = {
    title: 'Revival Video: Library',
    description: 'View the full Revival Video Library.',
};

export default async function GenrePage( req: any ) {
    const genreSlug = req.params.genre
    const genreName = getGenreNameBySlug( genreSlug )
    const tapes = await getTapesByGenre( genreSlug )

    if ( null === tapes ) {
        return
    }

    const session = await checkLoginStatus()
    const totalTapes = ( tapes as number[]).length
    let { page } = req.searchParams
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
                <h2>{ genreName } Library ({ totalTapes })</h2>
            </div>
            <WithPagination {...paginationProps} />
        </>
    )
}