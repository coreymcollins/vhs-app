import { ChangeEvent, FormEvent } from 'react';
import FetchGenres from '../fetch-genres';
import { format } from 'date-fns';
import Image from 'next/image'

interface TapeFormProps {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    selectedImage: File | null;
    handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    stateMessage: string;
    submitText: string;
    context: string;
    defaultValues: {
        tape_id: string;
        barcode: string;
        title: string;
        description: string;
        year: number | string;
        cover_front_url: string;
        genres: string[];
        date_added: string;
        date_updated: string;
    }
}

const getCurrentDate = (): string => {
    const currentDate = new Date();
    return format( currentDate, 'yyyy-MM-dd' )
}

export function TapeForm({ handleSubmit, selectedImage, handleImageChange, stateMessage, submitText, context, defaultValues }: TapeFormProps) {
    const { genres } = FetchGenres();
    const currentDate = getCurrentDate();

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
                        const isChecked = defaultValues.genres.includes( genre )
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
                        <>
                            <Image
                                src={selectedImage.toString()}
                                alt="front cover"
                                sizes="(min-width: 1024px) 768px, 180px"
                                quality={90}
                                priority={true}
                                style={{
                                    height: 'auto'
                                }}
                                width={178}
                                height={267}
                                className="image-upload-preview"
                            />
                        </>
                    )}
                    { ! selectedImage && defaultValues.cover_front_url ? (
                        <>
                            <Image
                                src={defaultValues.cover_front_url}
                                alt={`${defaultValues.title} front cover`}
                                sizes="(min-width: 1024px) 768px, 180px"
                                quality={90}
                                priority={true}
                                style={{
                                    height: 'auto'
                                }}
                                width={178}
                                height={267}
                                className="image-upload-preview"
                            />
                            <input type="hidden" name="existing_coverfront" value={defaultValues.cover_front_url} />
                        </>
                    ) : null }
                </div>
            </div>

            { 'add' === context ? (
                <>
                    <div className="form-row">
                        <label htmlFor="date-added">Date Added</label>
                        <input type="text" id="date-added" name="date_added" required defaultValue={currentDate} />
                    </div>

                    <div className="form-row">
                        <span className="label">Add To Library</span>
                        <label htmlFor="add-to-library" className="checkbox-label">
                            <input type="checkbox" id="add-to-library" name="add_to_library" value="true" /> Automatically add tape to your library
                        </label>
                    </div>
                </>
            ) : (
                <div className="form-row">
                    <label htmlFor="date-updated">Date Updated</label>
                    <input type="text" id="date-updated" name="date_updated" required readOnly value={currentDate} />
                </div>
            )}
            
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