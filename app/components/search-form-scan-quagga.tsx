'use client'

import { useState } from 'react';
import { searchByBarcode } from '@/app/actions';
import Quagga from '@ericblade/quagga2';
import { SearchResultGrid } from './grid-search-result';

const initialState = {
    message: 'Scan a barcode number or upload an image of a barcode to perform a search.',
};

export function BarcodeScanQuagga({session, req}: {session: any, req: any}) {
    const [state, setState] = useState(initialState);
    const [searchResult, setSearchResult] = useState<any | null>(null)

    let { page } = req.searchParams
    page = undefined === page ? 1 : page
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const barcode = formData.get('barcode') as string;

        
        try {
            setState({ message: 'Searching...' })
            setSearchResult(null)

            const result = await searchByBarcode(barcode)

            if (result) {
                setState({ message: `Tape found for barcode: ${barcode}` })
                setSearchResult(result)
            } else {
                setState({ message: `No tapes found for barcode: ${barcode}` })
                setSearchResult(null)
            }
        } catch (error) {
            setState({ message: `Error searching for tape: ${error}` })
            setSearchResult(null)
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const image = new Image();
                image.onload = async () => {
                    try {
                        setState({ message: 'Decoding barcode...'} )
                        setSearchResult(null)

                        // Decode barcode from the image
                        const barcode = await decodeBarcodeFromImage(image);

                        if (barcode) {
                            const result = await searchByBarcode(barcode);
                            if (result) {
                                setState({ message: `Tape found for barcode: ${barcode}` });
                                setSearchResult(result);
                            } else {
                                setState({ message: `No tapes found for barcode: ${barcode}` });
                                setSearchResult(null);
                            }
                        } else {
                            setState({ message: `No barcode found in the image.` });
                            setSearchResult(null);
                        }
                    } catch (error) {
                        setState({ message: `Error decoding barcode: ${error}` });
                        setSearchResult(null);
                    } finally {
                        fileInput.value = '';
                    }
                };
                image.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const decodeBarcodeFromImage = (image: HTMLImageElement): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            Quagga.decodeSingle(
                {
                    src: image.src,
                    numOfWorkers: 0,
                    inputStream: {
                        size: 800,
                    },
                    decoder: {
                        readers: ['upc_reader'], // Specify UPC-A reader
                    },
                },
                (result) => {
                    if (result && result.codeResult) {
                        resolve(result.codeResult.code);
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    };

    return (
        <form onSubmit={handleSubmit} className="search-form form">
            <div className="form-row">
                <label htmlFor="image">Upload Image</label>
                <input type="file" id="image" accept="image/*" onChange={handleImageUpload} />
            </div>

            { state.message && (
                <p aria-live="polite" role="status">
                    {state.message}
                </p>
            )}
                    
            { searchResult && (
                <>
                    <SearchResultGrid tapes={searchResult} session={session} pageNumber={page} context="search" />
                </>
            )}
        </form>
    );
}
