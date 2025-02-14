'use server'

import { createClient } from '@/utils/supabase/server';

export async function getGenreNameBySlug( genreSlug: string ) {

    if ( null === genreSlug ) {
        return { error: 'genre cannot be null' }
    }

    const supabase = createClient()

    const { data: genre, error: genreError } = await supabase
        .from('genres')
        .select('genre_name')
        .eq('genre_slug', genreSlug )
        .single();

    if ( null === genre ) {
        return { error: 'genre ID cannot be null' }
    }

    return genre.genre_name
}