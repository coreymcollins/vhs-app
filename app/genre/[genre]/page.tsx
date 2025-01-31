import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';
import { PaginationProps } from '@/app/components/types';
import { getGenreNameBySlug, getTapesByGenre } from '@/app/actions';

export async function generateMetadata( req: any ) {
    const genreSlug = req.params.genre
    
    if ( ! genreSlug ) {
        return {
            title: 'Revival Video',
            description: 'Be kind. Revive.',
        }
    }

    const genreName = await getGenreNameBySlug( genreSlug )

    return {
        title: `Revival Video: ${genreName} Library`,
        description: `View all tapes in the "${genreName}" genre.`,
    }
}

export default async function GenrePage( req: any ) {
    const genreSlug = req.params.genre
    const genreName = getGenreNameBySlug( genreSlug )
    const tapes = await getTapesByGenre( genreSlug )

    if ( 0 === Object.keys(tapes).length ) {
        return (
            <>
                <div className="page-content-header">
                    <h2>Genre { genreSlug } does not exist in the database</h2>
                </div>
            </>
        )
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