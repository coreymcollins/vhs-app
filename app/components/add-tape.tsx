'use client'

import { useState } from 'react';
import { createEntry } from '@/app/actions';
import { imageUpload } from './forms/image-upload';
import { TapeForm } from './forms/tape-form';

const initialState = {
    message: 'All fields are required.',
};

export function AddForm() {
    const [state, setState] = useState(initialState);
    const { selectedImage, handleImageChange } = imageUpload();

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

    const defaultValues = {
        tape_id: '',
        barcode: '',
        title: '',
        description: '',
        year: '',
        coverfront: null,
        genre_names: [],
    }

    return (
        <TapeForm
            handleSubmit={handleSubmit}
            selectedImage={selectedImage}
            handleImageChange={handleImageChange}
            stateMessage={state.message}
            defaultValues={defaultValues}
            submitText='Add Tape'
        />
    );
}
