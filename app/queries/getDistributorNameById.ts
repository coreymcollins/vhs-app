'use server'

import { createClient } from '@/utils/supabase/server';

export async function getDistributorNameById( distributorId: number ) {
    
    if ( null === distributorId ) {
        return { error: 'distributor id cannot be null' }
    }
    
    const supabase = createClient()
    
    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_name')
        .eq('distributor_id', distributorId )
        .single();
    
    if ( null === distributor ) {
        return { error: 'distributor id cannot be null' }
    }
    
    return distributor.distributor_name
}