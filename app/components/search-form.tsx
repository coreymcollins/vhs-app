'use client'

import { useState } from 'react';
import { searchByQuery } from '@/app/actions';
import { SearchResultGrid } from './grid-search-result';

const initialState = {
    message: 'Enter a search query to perform a search.',
};

export function SearchForm({session}: {session: any}) {
    const [state, setState] = useState(initialState);
    const [searchResult, setSearchResult] = useState<any | null>(null)
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const searchQuery = formData.get('search-query') as string
        
        try {
            const result = await searchByQuery(searchQuery)

            if (result) {
                setState({ message: `Tape found` })
                setSearchResult(result)
            } else {
                setState({ message: `No tapes found for query: ${searchQuery}` })
                setSearchResult(null)
            }
        } catch (error) {
            setState({ message: `Error searching for tape: ${error}` })
            setSearchResult(null)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form form">
            <div className="form-row">
                <label htmlFor="search-query">Search Query</label>
                <div>
                    <input type="text" id="search-query" name="search-query" required />
                    <button type="submit">Search</button>
                </div>
            </div>
            
            { searchResult ? (
                <>
                    <SearchResultGrid tapes={searchResult} session={session} />
                </>
            ) : (
                <p aria-live="polite" role="status">
                    {state.message}
                </p>
            )}
        </form>
    );
}
