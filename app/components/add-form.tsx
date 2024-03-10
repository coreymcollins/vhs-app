'use client'

import { useState } from 'react';
import { createEntry } from '@/app/actions';

const initialState = {
    message: 'All fields are required.',
};

export function AddForm() {
    const [state, setState] = useState(initialState);

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
        <form onSubmit={handleSubmit} className="add-form">
            <label htmlFor="barcode">Barcode</label>
            <input type="text" id="barcode" name="barcode" required />
            
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
            
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" required />
            
            <label htmlFor="genre">Genre</label>
            <input type="text" id="genre" name="genre" required />
            
            <label htmlFor="year">Year</label>
            <input type="number" id="year" name="year" required />

            <label htmlFor="coverfront">Front Cover</label>
            <input type="file" id="coverfront" name="coverfront" accept="image/*" />
            
            <button type="submit">Add</button>
            
            <p aria-live="polite" role="status">
                {state.message}
            </p>
        </form>
    );
}
