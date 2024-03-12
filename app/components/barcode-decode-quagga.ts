import { useState } from 'react';
import Quagga from '@ericblade/quagga2'

const initialState = {
    message: 'Scan a barcode to perform a search.',
};

const handleImageScan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [state, setState] = useState(initialState);
    const file = event.target.files?.[0]

    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                Quagga.decodeSingle(
                    {
                        src: reader.result,
                        numOfWorkers: 0,  // Disable worker threads for file input
                        inputStream: {
                            size: 2400  // Limit the size of the image for better performance
                        },
                        locator: {
                            patchSize: 'medium', // Adjust patch size for better detection
                            halfSample: true // Enable half sample for better detection
                        },
                        decoder: {
                            readers: ['upc_reader']  // Use 'upc_reader' for UPC barcodes
                        },
                    },
                    result => {
                        if (result && result.codeResult) {
                            const barcode = result.codeResult.code
                            // setSearchResult(barcode)
                        } else {
                            setState({ message: 'No barcode found in the image file' })
                            // setSearchResult(null)
                        }
                    }
                )
            }
        }
        reader.readAsDataURL(file)
    }
}

export default handleImageScan