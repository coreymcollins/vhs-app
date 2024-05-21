'use client'

import { useRef, useState } from 'react';
import { createEntry } from '@/app/actions';
import { ImageUpload } from './forms/image-upload';
import { TapeForm } from './forms/tape-form';

const initialState = {
    message: 'Title, Description, and Year are required.',
};

export function AddForm() {
    const [state, setState] = useState(initialState);
    const { selectedImage, handleImageChange, clearImage } = ImageUpload();
    const formRef = useRef<HTMLFormElement>(null);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            await createEntry(initialState, formData);
            setState({message: `Added "${formData.get( 'title' )}" successfully`})

            if ( formRef.current ) {
                formRef.current.reset()
            }

            clearImage()
        } catch ( error ) {
            setState({message: `Failed to add "${formData.get( 'title' )}"`})
        }
    };

    const defaultValues = {
        tape_id: '',
        barcode: '',
        title: '',
        description: '',
        year: '',
        cover_front_url: '',
        genres: [],
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
            formRef={formRef}
        />
    );
}
