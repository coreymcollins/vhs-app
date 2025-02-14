'use server'

import { createClient } from '@/utils/supabase/server';

export async function getTapesByGenre( genreName: string ) {

    if ( null === genreName ) {
        return { error: 'genre cannot be null' }
    }

    const supabase = createClient()

    const { data: genre, error: genreError } = await supabase
        .from('genres')
        .select('genre_id')
        .in('genre_slug', genreName.split( ',' ) );

    if ( genreError || ! genre || 0 === genre.length ) {
        return []
    }

    const genreIds = genre.map( genre => genre.genre_id )

    const { data: tapes, error: tapesError } = await supabase
        .from('tapes')
        .select(`
            *,
            tapes_genres:tapes_genres!inner (
                genre_id
            )
        `)
        .in('tapes_genres.genre_id', genreIds)
        .order( 'title' );

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return tapes;
}