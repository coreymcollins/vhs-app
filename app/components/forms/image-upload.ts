import { ChangeEvent, useState } from 'react';

export function ImageUpload() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if ( ! file ) {
            return;
        }

        setSelectedImage(file);
    }

    const clearImage = () => {
        setSelectedImage(null);
    };

    return { selectedImage, handleImageChange, clearImage }
}