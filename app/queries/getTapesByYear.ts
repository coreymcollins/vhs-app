'use server'

import { createClient } from '@/utils/supabase/server';

export async function getTapesByYear( year: number ) {

    if ( null === year ) {
        return { error: 'year cannot be null' }
    }

    const supabase = createClient()

    const { data: tapes, error: tapesError } = await supabase
        .from('tapes')
        .select(`*`)
        .eq('year', year)
        .order( 'title' );

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return tapes;
}