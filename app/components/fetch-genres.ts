'use client'

import { useEffect, useState } from 'react'
import { searchGenres } from '../actions'

export default function FetchGenres() {
    const [genres, setGenres ] = useState<string[]>([]);
    
    useEffect(() => {
        async function fetchGenres() {
            try {
                const genresData = await searchGenres()
                if ( genresData ) {
                    setGenres( genresData )
                }
            } catch ( error ) {
                console.error( 'Failed to fetch genres', error )
            }
        }
    
        fetchGenres()
    }, [])

    return { genres }
}