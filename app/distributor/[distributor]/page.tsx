import { checkLoginStatus } from '@/app/actions/check-login-status';
import { WithPagination } from '@/app/components/with-pagination';
import { PaginationProps } from '@/app/components/types';
import { getDistributorNameBySlug, getTapesByDistributor } from '@/app/actions';

export async function generateMetadata( req: any ) {
    const distributorSlug = req.params.distributor
    
    if ( ! distributorSlug ) {
        return {
            title: 'Revival Video',
            description: 'Be kind. Revive.',
        }
    }

    const distributorName = await getDistributorNameBySlug( distributorSlug )

    return {
        title: `Revival Video: ${distributorName} Library`,
        description: `View all tapes from ${distributorName}.`,
    }
}

export default async function DistributorPage( req: any ) {
    const distributorSlug = req.params.distributor
    const distributorName = getDistributorNameBySlug( distributorSlug )
    const tapes = await getTapesByDistributor( distributorSlug )
    
    if ( 0 === Object.keys(tapes).length ) {
        return (
            <>
                <div className="page-content-header">
                    <h2>Distributor { distributorSlug } does not exist in the database</h2>
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
                <h2>{ distributorName } Library ({ totalTapes })</h2>
            </div>
            <WithPagination {...paginationProps} />
        </>
    )
}