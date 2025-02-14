'use server'

import { createClient } from '@/utils/supabase/server';

export async function searchByQuery(queryString: string) {
    const supabase = createClient()

    const { data: tapes, error } = await supabase.rpc( 'get_tape_by_search_query', { querystring: queryString });

    if (error) {
        console.error(`Error searching for tape by barcode: ${queryString}`)
        throw error
    } else {
        return tapes;
    }
}