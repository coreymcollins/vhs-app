'use server'

import { createClient } from '@/utils/supabase/server';

export async function getUsersTapesByUuid( uuid: string ) {
    
    if ( ! uuid ) {
        return []
    }
    
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_tapes_by_user_id', { useridquery: uuid });
    
    if ( error ) {
        console.error( 'Error fetching tapes in collection:', error.message );
        return null;
    }

    return data;
}