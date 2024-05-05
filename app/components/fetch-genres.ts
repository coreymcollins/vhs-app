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
                    const genreNames = genresData.map( genre => genre.genre_name )
                    setGenres( genreNames )
                }
            } catch ( error ) {
                console.error( 'Failed to fetch genres', error )
            }
        }
    
        fetchGenres()
    }, [])

    return { genres }
}