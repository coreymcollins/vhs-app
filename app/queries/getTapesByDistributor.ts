'use server'

import { createClient } from '@/utils/supabase/server';

export async function getTapesByDistributor( distributorSlug: string ) {

    if ( null === distributorSlug ) {
        return { error: 'distributor cannot be null' }
    }

    const supabase = createClient()

    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_id')
        .in('distributor_slug', distributorSlug.split( ',' ) );

    if ( distributorError || ! distributor || 0 === distributor.length) {
        return []
    }

    const distributorIds = distributor.map( distributor => distributor.distributor_id )

    const { data: tapes, error: tapesError } = await supabase
        .from('tapes')
        .select(`
            *,
            tapes_distributors:tapes_distributors!inner (
                distributor_id
            )
        `)
        .in('tapes_distributors.distributor_id', distributorIds)
        .order( 'title' );

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return tapes;
}