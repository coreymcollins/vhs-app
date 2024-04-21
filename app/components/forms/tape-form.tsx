import { ChangeEvent, FormEvent } from 'react';
import FetchGenres from '../fetch-genres';

interface TapeFormProps {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    selectedImage: string | ArrayBuffer | null;
    handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    stateMessage: string;
}

export function TapeForm({ handleSubmit, selectedImage, handleImageChange, stateMessage }: TapeFormProps) {
    const { genres } = FetchGenres();

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
                {stateMessage}
            </p>
        </form>
    )
}