'use client'

import { useState } from 'react';
import { SearchResultTable } from './table-search-result';
import { searchByQuery } from '@/app/actions';

const initialState = {
    message: 'Enter a barcode number to perform a search.',
};

export function SearchForm() {
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
                setState({ message: `No tapes found for barcode: ${searchQuery}` })
                setSearchResult(null)
            }
        } catch (error) {
            setState({ message: `Error searching for tape: ${error}` })
            setSearchResult(null)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form form">
            <label htmlFor="search-query">Search Query</label>
            <input type="text" id="search-query" name="search-query" required />

            <button type="submit">Search</button>
            
            { searchResult ? (
                <>
                    <SearchResultTable tapes={searchResult} />
                </>
            ) : (
                <p aria-live="polite" role="status">
                    {state.message}
                </p>
            )}
        </form>
    );
}
