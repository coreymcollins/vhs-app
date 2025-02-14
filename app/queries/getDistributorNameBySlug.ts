'use server'

import { createClient } from '@/utils/supabase/server';

export async function getDistributorNameBySlug( distributorSlug: string ) {
    
    if ( null === distributorSlug ) {
        return { error: 'distributor cannot be null' }
    }
    
    const supabase = createClient()
    
    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_name')
        .eq('distributor_slug', distributorSlug )
        .single();
    
    if ( null === distributor ) {
        return { error: 'distributor ID cannot be null' }
    }
    
    return distributor.distributor_name
}