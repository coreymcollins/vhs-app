'use client'

import { useState, useEffect } from 'react';
import { createEntry, searchGenres } from '@/app/actions';

const initialState = {
    message: 'All fields are required.',
};

export function AddForm() {
    const [state, setState] = useState(initialState);
    const [genres, setGenres ] = useState<string[]>([]);

    useEffect(() => {
        async function fetchGenres() {
            try {
                const genresData = await searchGenres()
                if ( genresData ) {
                    setGenres( genresData )
                }
            } catch ( error ) {
                console.error( 'Failed to fetch genres', error )
            }
        }

        fetchGenres()
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        
        try {
            const response = await createEntry(initialState, formData);
            setState({ message: 'Tape added successfully.' });
        } catch (error) {
            setState({ message: 'Error adding tape.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-form add-form-tape form">
            <div className="form-row">
                <label htmlFor="barcode">Barcode</label>
                <input type="text" id="barcode" name="barcode" className="input-barcode" maxLength={30} required />
            </div>
            
            <div className="form-row">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" className="input-title" required />
            </div>
            
            <div className="form-row">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" className="input-description" rows={5} required />
            </div>
            
            <div className="form-row">
                <label htmlFor="genres">Genres</label>
                {/* <input type="text" id="genre" name="genre" required /> */}
                <select id="genres" name="genres" className="input-genres" multiple required>
                    {genres.map(( genre, index ) => (
                        <option key={index} value={genre}>{genre}</option>
                    ))}
                </select>
            </div>
            
            <div className="form-row">
                <label htmlFor="year">Year</label>
                <input type="number" id="year" name="year" className="input-year" required />
            </div>

            <div className="form-row">
                <label htmlFor="coverfront">Front Cover</label>
                <input type="file" id="coverfront" name="coverfront" accept="image/*" className="input-cover" />
            </div>
            
            <div className="form-row form-row-single">
                <button type="submit">Add</button>
            </div>
            
            <p aria-live="polite" role="status">
                {state.message}
            </p>
        </form>
    );
}
