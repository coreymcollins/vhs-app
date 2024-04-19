'use client'

import { useState } from 'react';
import { updateEntry } from '@/app/actions';
import FetchGenres from './fetch-genres';

const initialState = {
    message: 'All fields are required.',
};

export function EditForm({ tape }: any) {
    const { tape_id, barcode, title, description, year, coverfront, genre_names } = tape;
    const [state, setState] = useState(initialState);
    const { genres } = FetchGenres();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const genres = formData.getAll( 'genres' )
        console.log( 'genres', genres )
        
        try {
            const response = await updateEntry(initialState, formData);
            setState({ message: 'Tape updated successfully.' });
        } catch (error) {
            setState({ message: 'Error updating tape.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-form add-form-tape form">
            <div className="form-row readonly">
                <label htmlFor="barcode">ID</label>
                <input type="text" id="tape_id" name="tape_id" className="input-tape_id" maxLength={30} readOnly defaultValue={tape_id} />
            </div>
            <div className="form-row">
                <label htmlFor="barcode">Barcode</label>
                <input type="text" id="barcode" name="barcode" className="input-barcode" maxLength={30} defaultValue={barcode} inputMode="numeric" />
            </div>
            
            <div className="form-row">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" className="input-title" required defaultValue={title} />
            </div>
            
            <div className="form-row">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" className="input-description" rows={5} required defaultValue={description} />
            </div>
            
            <div className="form-row">
                <label htmlFor="Genres">Genres</label>
                <div className="genres-checkboxes">
                    {genres.map(( genre, index ) => {
                        const isChecked = !!(tape && genre_names && genre_names.includes(genre) && genre_names !== "");
                        return (
                            <label key={index} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="genres"
                                    className="checkbox-genre"
                                    value={genre}
                                    defaultChecked={isChecked}
                                />
                                {genre}
                            </label>
                        )
                    })}
                </div>
            </div>
            
            <div className="form-row">
                <label htmlFor="year">Year</label>
                <input type="number" id="year" name="year" className="input-year" required defaultValue={year} inputMode="numeric" />
            </div>

            <div className="form-row">
                <label htmlFor="coverfront">Front Cover</label>
                <div>
                    { coverfront && coverfront.length > 0 ? (
                        <img src={`data:image/jpeg;base64,${coverfront.toString('base64')}`} alt={`${title} front cover`} className="cover-front" />
                    ) : null }
                    <input type="file" id="coverfront" name="coverfront" accept="image/*" className="input-cover" />
                </div>
            </div>
            
            <div className="form-row form-row-single">
                <button type="submit">Update</button>
            </div>
            
            <p aria-live="polite" role="status">
                {state.message}
            </p>
        </form>
    );
}
