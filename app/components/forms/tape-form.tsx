import { ChangeEvent, FormEvent } from 'react';
import FetchGenres from '../fetch-genres';

interface TapeFormProps {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    selectedImage: Buffer | null;
    handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    stateMessage: string;
    submitText: string;
    defaultValues: {
        tape_id: string;
        barcode: string;
        title: string;
        description: string;
        year: number | string;
        coverfront: Buffer | null;
        genre_names: string[];
    }
}

export function TapeForm({ handleSubmit, selectedImage, handleImageChange, stateMessage, submitText, defaultValues }: TapeFormProps) {
    const { genres } = FetchGenres();

    return (
        <form onSubmit={handleSubmit} className="add-form add-form-tape form">
            { defaultValues.tape_id && (
                <div className="form-row readonly">
                    <label htmlFor="barcode">ID</label>
                    <input type="text" id="tape_id" name="tape_id" className="input-tape_id" maxLength={30} readOnly defaultValue={defaultValues.tape_id} />
                </div>
            )}
            <div className="form-row">
                <label htmlFor="barcode">Barcode</label>
                <input type="text" id="barcode" name="barcode" className="input-barcode" maxLength={30} defaultValue={defaultValues.barcode} />
            </div>
            
            <div className="form-row">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" className="input-title" required defaultValue={defaultValues.title} />
            </div>
            
            <div className="form-row">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" className="input-description" rows={5} required defaultValue={defaultValues.description} />
            </div>
            
            <div className="form-row">
                <label htmlFor="Genres">Genres</label>
                <div className="genres-checkboxes">
                    {genres.map(( genre, index ) => {
                        const isChecked = defaultValues.genre_names.includes( genre )
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
                <input type="number" id="year" name="year" className="input-year" required defaultValue={defaultValues.year} />
            </div>

            <div className="form-row">
                <label htmlFor="coverfront">Front Cover</label>
                <div className="image-container">
                    <input type="file" id="coverfront" name="coverfront" accept="image/*" className="input-cover" onChange={handleImageChange} />
                    { selectedImage && (
                        <img
                            src={selectedImage.toString()}
                            alt="Uploaded image"
                            className="image-upload-preview"
                        />
                    )}
                    { ! selectedImage && defaultValues.coverfront && defaultValues.coverfront.length > 0 ? (
                        <>
                            <img
                                src={`data:image/jpeg;base64,${defaultValues.coverfront.toString('base64')}`}
                                alt={`${defaultValues.title} front cover`}
                                className="image-upload-preview"
                            />
                            <input type="hidden" name="existing_coverfront" value={defaultValues.coverfront.toString('base64')} />
                        </>
                    ) : null }
                </div>
            </div>
            
            <div className="form-row form-row-single">
                <button type="submit">{submitText}</button>
            </div>

            <div className="form-row form-row-single">
                <p aria-live="polite" role="status" className="form-message">
                    {stateMessage}
                </p>
            </div>
            
        </form>
    )
}