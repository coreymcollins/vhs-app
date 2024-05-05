'use client'

import { useState } from 'react';
import { updateEntry } from '@/app/actions';
import FetchGenres from './fetch-genres';
import { ImageUpload } from './forms/image-upload';
import { TapeForm } from './forms/tape-form';

const initialState = {
    message: 'Edit any desired fields. To replace the cover, upload a new image.',
};

export function EditForm({ tape }: any) {
    const { tape_id, barcode, title, description, year, coverfront, genre_names, date_added, date_updated } = tape;
    const [state, setState] = useState(initialState);
    const { genres } = FetchGenres();
    const { selectedImage, handleImageChange } = ImageUpload();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        console.log( 'formData', formData )
        const genres = formData.getAll( 'genres' )
        
        try {
            const response = await updateEntry(initialState, formData);
            setState({ message: 'Tape updated successfully.' });
        } catch (error) {
            setState({ message: 'Error updating tape.' });
        }
    };

    const defaultValues = {
        tape_id,
        barcode,
        title,
        description,
        year,
        coverfront,
        genre_names,
        date_added,
        date_updated,
    }

    return (
        <TapeForm
            handleSubmit={handleSubmit}
            selectedImage={selectedImage}
            handleImageChange={handleImageChange}
            stateMessage={state.message}
            defaultValues={defaultValues}
            context='edit'
            submitText='Update Tape'
        />
    );
}
