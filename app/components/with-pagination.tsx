import { SearchResultGrid } from './grid-search-result';
import { PaginationProps } from './types';

export async function WithPagination(props: PaginationProps) {
    
    return (
        <>
            <SearchResultGrid {...props} />
        </>
    )
}