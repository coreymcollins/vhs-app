import { createClient } from '@/utils/supabase/client';

export async function getAllDistributors() {
    const supabase = createClient()

    let { data: distributors, error } = await supabase
        .from( 'distributors' )
        .select( `*` )
        .order( 'distributor_name_lower' )

    if ( error ) {
        console.error( 'error in adding a new tape:', error )
        return null;
    }

    return distributors;
}