import { ChangeEvent, useState } from 'react';

export function ImageUpload() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if ( ! file ) {
            return;
        }

        const reader = new FileReader()

        reader.onload = () => {
            setSelectedImage( reader.result as File | null )
        }

        reader.readAsDataURL( file )
    }

    return { selectedImage, handleImageChange }
}