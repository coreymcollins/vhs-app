'use client'

import React, { useState, useEffect, MouseEvent, FC } from 'react';
import { getSiteUrl } from '../actions'

interface CopyCollectionUrlProps {
    username: string;
}

const CopyCollectionUrl: FC<CopyCollectionUrlProps> = ( {username} ) => {
    const defaultButtonText = 'Copy Collection URL'
    const successfulButtonText = 'Copied URL to clipboard!'
    const errorButtonText = 'Could not copy URL to clipboard'
    const [siteUrl, setSiteUrl] = useState<string | null>(null)
    const [buttonText, setButtonText] = useState<string>( defaultButtonText )

    useEffect(() => {
        const fetchSiteUrl = async () => {
            const url = await getSiteUrl()
            setSiteUrl( url )
        }

        fetchSiteUrl()
    }, [])

    if ( ! siteUrl ) {
        return null
    }
    
    const handleButtonClick = async( event: MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget
        let collectionUrl = button.getAttribute( 'data-collection-url' )
    
        if ( collectionUrl ) {
            try {
                await navigator.clipboard.writeText( collectionUrl )
                setButtonText( successfulButtonText )
                setTimeout(() => setButtonText( defaultButtonText ), 2000 )
            } catch( error ) {
                setButtonText( errorButtonText )
                setTimeout(() => setButtonText( defaultButtonText ), 2000 )
                console.error( 'Failed to copy URL:', error )
            }
        } else {
            setButtonText( errorButtonText )
            setTimeout(() => setButtonText( defaultButtonText ), 2000 )
            console.error( 'No Collection URL found' )
        }
    }

    return (
        <button
            className="copy-collection-url button-library"
            data-collection-url={`${siteUrl}/collection/${username}`}
            onClick={handleButtonClick}
        >
            {buttonText}
        </button>
    )
}

export default CopyCollectionUrl