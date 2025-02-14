'use server'

import { createClient } from '@/utils/supabase/server';

export async function getUserTapeIds( userId: string ) {

    if ( ! userId ) {
        return [];
    }

    const supabase = createClient()

    const { data, error } = await supabase
        .from( 'users_tapes' )
        .select( 'tape_id' )
        .eq( 'uuid', userId )
        .order( 'tape_id' )

    if (error) {
        console.error(`Error getting tapes for user`)
        throw error
    } else {
        const tapeIds = data.map(item => item.tape_id);
        return tapeIds;
    }
}