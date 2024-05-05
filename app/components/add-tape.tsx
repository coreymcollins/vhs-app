'use client'

import { useState } from 'react';
import { createEntry } from '@/app/actions';
import { ImageUpload } from './forms/image-upload';
import { TapeForm } from './forms/tape-form';
import { checkLoginStatus } from '../auth/signout/route';

const initialState = {
    message: 'All fields are required.',
};

export function AddForm() {
    const [state, setState] = useState(initialState);
    const { selectedImage, handleImageChange } = ImageUpload();
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const response = await createEntry(initialState, formData);
        // if ( error ) {
        //     setState({ message: 'Error adding tape.' });
        // } else {
        //     setState({ message: 'Tape added successfully.' });
        // }
    };

    const defaultValues = {
        tape_id: '',
        barcode: '',
        title: '',
        description: '',
        year: '',
        coverfront: null,
        genre_names: [],
        date_added: '',
        date_updated: '',
    }

    return (
        <TapeForm
            handleSubmit={handleSubmit}
            selectedImage={selectedImage}
            handleImageChange={handleImageChange}
            stateMessage={state.message}
            defaultValues={defaultValues}
            context='add'
            submitText='Add Tape'
        />
    );
}
