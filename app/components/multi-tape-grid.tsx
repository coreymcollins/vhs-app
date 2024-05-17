import Link from 'next/link';
import { SingleTapeGrid } from './single-tape-grid';
import { useRouter } from 'next/navigation';

export function MultiTapeGrid({tapes, context, session, userTapeIds, pageNumber}: {tapes: any[], context: string, session: any, userTapeIds: any, pageNumber: number}) {
    const tapesArray = Array.isArray(tapes) ? tapes : [tapes]
    const router = useRouter()

    if ( null === tapesArray ) {
        return;
    }

    const totalPosts = tapesArray.length
    const postsPerPage = 32
    const from = 1 === pageNumber ? 0 : ( pageNumber - 1 ) * postsPerPage
    const to = 1 === pageNumber ? postsPerPage : from + postsPerPage

    const handlePrevPage = ( event: any ) => {
        event.preventDefault()
        router.push( `?page=${(Number(pageNumber) - 1)}` )
    }

    const handleNextPage = ( event: any ) => {
        event.preventDefault()
        router.push( `?page=${(Number(pageNumber) + 1)}` )
    }

    return (
        <>
            <div className="tape-results grid">
                {tapesArray.slice( from, to ).map(( tape ) => (
                    <SingleTapeGrid key={`listing-${tape.tape_id}`} tape={tape} context="search" session={session} userTapeIds={userTapeIds} />
                ))}
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