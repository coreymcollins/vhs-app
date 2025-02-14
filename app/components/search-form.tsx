'use client'

import { useState } from 'react';
import { searchByQuery } from '@/app/queries/searchByQuery';
import { SearchResultGrid } from './grid-search-result';

const initialState = {
    message: 'Enter a search query to perform a search.',
};

export function SearchForm({session, req}: {session: any, req: any}) {
    const [state, setState] = useState(initialState);
    const [searchResult, setSearchResult] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState( '' )
    
    let { page } = req.searchParams;
    page = undefined === page ? 1 : page;
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let trimmedQuery = searchQuery.trim()

        if ( ! trimmedQuery ) {
            setState({ message: 'Search query can not be empty' })
            return
        }

        setState({ message: 'Searching...' })
        setSearchResult(null)
        
        try {
            const result = await searchByQuery(trimmedQuery)

            if (result && result.length > 0) {
                let count = result.length
                let resultWord = 1 === count ? 'result' : 'results'
                setState({ message: `${count} ${resultWord} found for "${trimmedQuery}"` })
                setSearchResult(result)
            } else {
                setState({ message: `0 results found for "${trimmedQuery}"` })
                setSearchResult(null)
            }
        } catch (error) {
            setState({ message: `Error searching: ${error}` })
            setSearchResult(null)
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    return (
        <form onSubmit={handleSubmit} className="search-form form">
            <div className="form-row">
                <label htmlFor="search-query">Search Query</label>
                <div>
                    <input
                        type="text"
                        id="search-query"
                        name="search-query"
                        value={searchQuery}
                        onChange={handleChange}
                        required
                    />
                    <button className="button" type="submit">Search</button>
                </div>
            </div>
            
            { state.message && (
                <p aria-live="polite" role="status">
                    {state.message}
                </p>

            )}
            
            { searchResult && (
                <>
                    <SearchResultGrid
                        tapes={searchResult}
                        session={session}
                        pageNumber={page}
                        context="search"
                    />
                </>
            )}

        </form>
    );
}
