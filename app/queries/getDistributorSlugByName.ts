'use server'

import { createClient } from '@/utils/supabase/server';

export async function getDistributorSlugByName( distributorName: string ) {

    if ( null === distributorName ) {
        return { error: 'distributor cannot be null' }
    }

    const supabase = createClient()

    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_slug')
        .eq('distributor_slug', distributorName )
        .single();

    if ( null === distributor ) {
        return { error: 'distributor ID cannot be null' }
    }

    return distributor.distributor_slug
}