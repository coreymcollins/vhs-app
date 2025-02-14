import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import FetchGenres from '../fetch-genres';
import { format } from 'date-fns';
import Image from 'next/image'
import SearchableSelect from '../distributor-input';
import { getDistributorNameById } from '@/app/queries/getDistributorNameById';

interface TapeFormProps {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    selectedImage: File | null;
    imagePreviewUrl: string | null;
    handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    stateMessage: string;
    submitText: string;
    context: string;
    formRef: React.RefObject<HTMLFormElement>;
    defaultValues: {
        tape_id: string;
        barcode: string;
        title: string;
        description: string;
        year: number | string;
        cover_front_url: string;
        genres: string[];
        distributor: number | null;
        distributor_name: string;
        date_added: string;
        date_updated: string;
    }
}

const getCurrentDate = (): string => {
    const currentDate = new Date();
    return format( currentDate, 'yyyy-MM-dd' )
}

export function TapeForm({ handleSubmit, selectedImage, imagePreviewUrl, handleImageChange, stateMessage, submitText, context, formRef, defaultValues }: TapeFormProps) {
    const { genres } = FetchGenres();
    const currentDate = getCurrentDate();
    const [distributorName, setDistributorName] = useState<string | null>(null);
    const [selectedDistributor, setSelectedDistributor] = useState({
        distributor_id: defaultValues?.distributor || null,
        distributor_name: distributorName || 'Loading...'
    })

    useEffect(() => {
        const fetchDistributorName = async () => {
            if ( defaultValues.distributor ) {
                const name = await getDistributorNameById( defaultValues.distributor )
                setDistributorName( name )
            } else {
                setDistributorName( null )
            }
        }

        fetchDistributorName()
    }, [defaultValues.distributor])

    useEffect(() => {
        setSelectedDistributor({
            distributor_id: defaultValues.distributor || null,
            distributor_name: distributorName || '',
        });
    }, [distributorName, defaultValues.distributor])

    return (
        <form onSubmit={handleSubmit} className="add-form add-form-tape form" ref={formRef}>
            { defaultValues.tape_id && (
                <div className="form-row readonly screen-reader-only">
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
                <label htmlFor="Distributor">Distributor</label>
                <div className="distributors-checkboxes">
                    <SearchableSelect
                        initialValue={selectedDistributor}
                        onChange={( selected ) => {
                            setSelectedDistributor(
                                selected || {
                                    distributor_id: null,
                                    distributor_name: '',
                                }
                            )
                        }}
                    />

                    <input
                        type="text"
                        id="distributor-name"
                        name="distributor_name"
                        className="input-title"
                        defaultValue={selectedDistributor.distributor_name}
                        value={selectedDistributor.distributor_name}
                        hidden
                    />
                </div>
            </div>
            
            <div className="form-row">
                <label htmlFor="year">VHS Release Year</label>
                <input type="number" id="year" name="year" className="input-year" required defaultValue={defaultValues.year} />
            </div>

            <div className="form-row">
                <label htmlFor="coverfront">Front Cover</label>
                <div className="image-container">
                    <input type="file" id="coverfront" name="coverfront" accept="image/*" className="input-cover" onChange={handleImageChange} />
                    { imagePreviewUrl && (
                        <>
                            <Image
                                src={imagePreviewUrl}
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
                    { ! imagePreviewUrl && defaultValues.cover_front_url ? (
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
                        <span className="label">Add To Collection</span>
                        <label htmlFor="add-to-library" className="checkbox-label">
                            <input type="checkbox" id="add-to-library" name="add_to_library" value="true" /> Automatically add tape to your collection
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
                <button className="button" type="submit">{submitText}</button>
            </div>

            <div className="form-row form-row-single">
                <p aria-live="polite" role="status" className="form-message">
                    {stateMessage}
                </p>
            </div>
            
        </form>
    )
}