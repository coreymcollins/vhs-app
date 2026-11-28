import { ChangeEvent, useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';

interface SelectedImages {
    [key: string]: File | null;
}

interface ImagePreviews {
    [key: string]: string | null;
}

export function ImageUpload() {
    const [selectedImages, setSelectedImages] = useState<SelectedImages>({})
    const [imagePreviewUrls, setImagePreviewUrls] = useState<ImagePreviews>({})
    const [ocrText, setOcrText] = useState<string>('')
    const [ocrLoading, setOcrLoading] = useState<boolean>(false)

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        const file = event.target.files?.[0]

        if ( ! file || ! name ) {
            return;
        }

        if (imagePreviewUrls[name]) {
            URL.revokeObjectURL(imagePreviewUrls[name]!);
        }

        setSelectedImages(( prev ) => ({
            ...prev,
            [name]: file,
        }));

        setImagePreviewUrls(( prev ) => ({
            ...prev,
            [name]: URL.createObjectURL( file ),
        }));

        if (name === 'coverback') {
            setOcrLoading(true);
            setOcrText('');

            try {
                const worker = await createWorker('eng');
                const { data } = await worker.recognize(file);

                setOcrText(data.text);
                await worker.terminate();
            } catch (error) {
                console.error('OCR Error:', error);
                setOcrText('Failed to extract text.');
            } finally {
                setOcrLoading(false);
            }
        }
    }

    const clearImages = () => {

        Object.values(imagePreviewUrls).forEach((url) => {
            if (url) URL.revokeObjectURL(url);
        });

        setSelectedImages({});
        setImagePreviewUrls({});
        setOcrText('');
    };

    useEffect(() => {
        return () => {
            Object.values( imagePreviewUrls ).forEach(( url ) => {
                if ( url ) {
                    URL.revokeObjectURL( url );
                }
            });
        }
    }, [imagePreviewUrls])

    return { selectedImages, imagePreviewUrls, handleImageChange, clearImages, ocrText, ocrLoading }
}
