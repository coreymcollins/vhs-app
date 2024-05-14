import { SearchResultGrid } from './grid-search-result';

export async function WithPagination({ tapes, session, pageNumber }: { tapes: any, session: any, pageNumber: number }) {
    
    return (
        <>
            <SearchResultGrid tapes={tapes} session={session} pageNumber={pageNumber} />
        </>
    )
}