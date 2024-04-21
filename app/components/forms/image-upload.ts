import { ChangeEvent, useState } from 'react';

export function imageUpload() {
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if ( ! file ) {
            return;
        }

        const reader = new FileReader()
        reader.onload = () => {
            setSelectedImage( reader.result )
        }

        reader.readAsDataURL( file )
    }

    return { selectedImage, handleImageChange }
}