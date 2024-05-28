import { ChangeEvent, useEffect, useState } from 'react';

export function ImageUpload() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if ( ! file ) {
            return;
        }

        setSelectedImage(file);
        setImagePreviewUrl( URL.createObjectURL( file ) )
    }

    const clearImage = () => {

        if ( imagePreviewUrl ) {
            URL.revokeObjectURL( imagePreviewUrl )
        }

        setSelectedImage( null )
        setImagePreviewUrl( null )
    };

    useEffect(() => {
        return () => {
            if ( imagePreviewUrl ) {
                URL.revokeObjectURL( imagePreviewUrl )
            }
        }
    }, [imagePreviewUrl])

    return { selectedImage, imagePreviewUrl, handleImageChange, clearImage }
}
