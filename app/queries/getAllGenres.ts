import { createClient } from '@/utils/supabase/client';

export async function getAllGenres() {
    const supabase = createClient()

    let { data: genres, error } = await supabase
        .from( 'genres' )
        .select( '*' )
        .order( 'genre_name' )

    if ( error ) {
        console.error( 'error in getting genres:', error )
        return null;
    }

    return genres;
}