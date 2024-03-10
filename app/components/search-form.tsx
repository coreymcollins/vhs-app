'use client'

import { useState } from 'react';
import { searchByBarcode } from '@/app/actions';
import { SearchResultTable } from './table-search-result';

const initialState = {
    message: 'Enter a barcode number to perform a search.',
};

export function SearchForm() {
    const [state, setState] = useState(initialState);
    const [searchResult, setSearchResult] = useState<any | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const barcode = formData.get('barcode') as string
        
        try {
            const result = await searchByBarcode(barcode)

            if (result) {
                setState({ message: `Tape found` })
                setSearchResult(result)
            } else {
                setState({ message: `No tapes found for barcode: ${barcode}` })
                setSearchResult(null)
            }
        } catch (error) {
            setState({ message: `Error searching for tape: ${error}` })
            setSearchResult(null)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form form">
            <label htmlFor="barcode">Barcode</label>
            <input type="text" id="barcode" name="barcode" required />
            
            <button type="submit">Search</button>
            
            { searchResult ? (
                <>
                    <SearchResultTable tape={searchResult} />
                </>
            ) : (
                <p aria-live="polite" role="status">
                    {state.message}
                </p>
            )}
        </form>
    );
}
