'use client'

import { useEffect, useState } from 'react'
import { getAllGenres } from '@/app/queries/getAllGenres'

export default function FetchGenres() {
    const [genres, setGenres ] = useState<string[]>([]);
    
    useEffect(() => {
        async function fetchGenres() {
            try {
                const genresData = await getAllGenres()

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