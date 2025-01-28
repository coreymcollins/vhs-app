import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';
import { PaginationProps } from '@/app/components/types';
import { getTapesByYear } from '@/app/actions';

export async function generateMetadata( req: any ) {
    const year = req.params.year
    
    if ( ! year ) {
        return {
            title: 'Revival Video',
            description: 'Be kind. Revive.',
        }
    }

    return {
        title: `Revival Video: ${year} Library`,
        description: `View all tapes in the "${year}" genre.`,
    }
}

export default async function YearPage( req: any ) {
    const year = req.params.year
    const tapes = await getTapesByYear( year )

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
                <h2>{ year } Library ({ totalTapes })</h2>
            </div>
            <WithPagination {...paginationProps} />
        </>
    )
}