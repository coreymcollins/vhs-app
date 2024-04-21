'use client'

import { ChangeEvent, useState } from 'react';
import { createEntry } from '@/app/actions';
import FetchGenres from './fetch-genres';

const initialState = {
    message: 'All fields are required.',
};

export function AddForm() {
    const [state, setState] = useState(initialState);
    const { genres } = FetchGenres();
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);

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

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if ( ! file ) {
            return;
        }

        const reader = new FileReader()
        reader.onload = () => {
            setSelectedImage( reader.result )
        }

        reader.readAsDataURL( file )
    }

    return (
        <form onSubmit={handleSubmit} className="add-form add-form-tape form">
            <div className="form-row">
                <label htmlFor="barcode">Barcode</label>
                <input type="text" id="barcode" name="barcode" className="input-barcode" maxLength={30} />
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
                <label htmlFor="Genres">Genres</label>
                <div className="genres-checkboxes">
                    {genres.map(( genre, index ) => (
                        <label key={index} className="checkbox-label">
                            <input type="checkbox" name="genres" value={genre} className="checkbox-genre" />{genre}
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="form-row">
                <label htmlFor="year">Year</label>
                <input type="number" id="year" name="year" className="input-year" required />
            </div>

            <div className="form-row">
                <label htmlFor="coverfront">Front Cover</label>
                <div className="image-container">
                    <input type="file" id="coverfront" name="coverfront" accept="image/*" className="input-cover" onChange={handleImageChange} />
                    { selectedImage && (
                        <img src={selectedImage.toString()} alt="Uploaded image" className="image-upload-preview" />
                    )}
                </div>
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
