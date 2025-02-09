'use client'

import { useRef, useState } from 'react';
import { updateEntry } from '@/app/actions';
import { ImageUpload } from './forms/image-upload';
import { TapeForm } from './forms/tape-form';

const initialState = {
    message: 'Edit any desired fields. To replace the cover, upload a new image.',
};

export function EditForm({ tape }: any) {
    const { tape_id, barcode, title, description, year, cover_front_url, date_added, date_updated, distributor_name } = tape;
    const genres = tape.tapes_genres.map((tapes_genres: any) => tapes_genres.genres.genre_name);
    const distributor = tape.tapes_distributors?.distributor_id
    const [state, setState] = useState(initialState);
    const { selectedImage, imagePreviewUrl, handleImageChange } = ImageUpload();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        
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
        cover_front_url,
        genres,
        date_added,
        distributor,
        distributor_name,
        date_updated,
    }

    return (
        <TapeForm
            handleSubmit={handleSubmit}
            selectedImage={selectedImage}
            imagePreviewUrl={imagePreviewUrl}
            handleImageChange={handleImageChange}
            stateMessage={state.message}
            defaultValues={defaultValues}
            context='edit'
            submitText='Update Tape'
            formRef={formRef}
        />
    );
}
