import { ChangeEvent, useState } from 'react';

export function imageUpload() {
    const [selectedImage, setSelectedImage] = useState<Buffer | null>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if ( ! file ) {
            return;
        }

        const reader = new FileReader()
        
        reader.onload = () => {
            setSelectedImage( reader.result as Buffer | null )
        }

        reader.readAsDataURL( file )
    }

    return { selectedImage, handleImageChange }
}