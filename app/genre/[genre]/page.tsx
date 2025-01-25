import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';
import { PaginationProps } from '@/app/components/types';
import { Metadata } from 'next';
import { getTapesByGenre } from '@/app/actions';

export const metadata: Metadata = {
    title: 'Revival Video: Library',
    description: 'View the full Revival Video Library.',
};

export default async function GenrePage( req: any ) {
    const genreName = req.params.genre
    let genreNameUppercase : string = genreName.replace( /-/g, ' ' )
    genreNameUppercase = genreNameUppercase.split( ' ' ).map( genreNameUppercase => genreNameUppercase.charAt(0).toUpperCase() + genreNameUppercase.slice( 1 ) ).join( ' ')
    const tapes = await getTapesByGenre( genreName )

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
                <h2>{ genreNameUppercase } Library ({ totalTapes })</h2>
            </div>
            <WithPagination {...paginationProps} />
        </>
    )
}