import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PaginationProps } from './types'
import RealtimeTapes from './realtime-tapes'

export interface MultiTapeGridProps extends PaginationProps {
    userTapeIds: number[];
    username: string | '';
}

export function MultiTapeGrid( props: MultiTapeGridProps ) {
    let {tapes, pageNumber} = props
    const router = useRouter()
    const searchParams = useSearchParams()
    
    if ( null === tapes ) {
        return;
    }
    
    const updatedQuery = new URLSearchParams( searchParams.toString() )
    const currentPage = Number( searchParams.get( 'page' ) ) || 1
    updatedQuery.set( 'page', String( currentPage + 1 ) )
    const totalPosts = tapes.length
    const postsPerPage = 32
    const from = 1 === pageNumber ? 0 : ( pageNumber - 1 ) * postsPerPage
    const to = 1 === pageNumber ? postsPerPage : from + postsPerPage

    const handlePrevPage = ( event: any ) => {
        event.preventDefault()
        updatedQuery.set( 'page', String( currentPage - 1 ) )
        router.push( `?${updatedQuery.toString()}` )
    }

    const handleNextPage = ( event: any ) => {
        event.preventDefault()
        router.push( `?${updatedQuery.toString()}` )
    }

    const updatedProps = {
        ...props,
        from,
        to
    }

    return (
        <>
            <div className="tape-results grid">
                <RealtimeTapes {...updatedProps} />
            </div>
            <div className="pagination">
                { pageNumber > 1 && (
                    <Link href="#" onClick={handlePrevPage} className="previous-link">Previous Page</Link>
                )}
                { totalPosts > ( postsPerPage * pageNumber ) && (
                    <Link href="#" onClick={handleNextPage} className="next-link">Next Page</Link>
                )}
            </div>
        </>
    )
}