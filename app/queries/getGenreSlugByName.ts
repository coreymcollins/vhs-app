'use server'

import { createClient } from '@/utils/supabase/server';

export async function getGenreSlugByName( genreName: string ) {

    if ( null === genreName ) {
        return { error: 'genre cannot be null' }
    }

    const supabase = createClient()

    const { data: genre, error: genreError } = await supabase
        .from('genres')
        .select('genre_slug')
        .eq('genre_slug', genreName )
        .single();

    if ( null === genre ) {
        return { error: 'genre ID cannot be null' }
    }

    return genre.genre_slug
}