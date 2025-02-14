'use server'

import { createClient } from '@/utils/supabase/server';

export async function getUserCollection( username: string ) {

    if ( null === username ) {
        return { error: 'Username cannot be null' }
    }

    const supabase = createClient()

    const { data: user, error: userError } = await supabase
        .from( 'users' )
        .select( 'uuid' )
        .eq( 'username', username )
        .maybeSingle()
    
    if ( userError ) {
        console.error( 'Error fetching user:', userError.message );
        return { error: `Error fetching user: ${userError.message}`} 
    }

    if ( null === user ) {
        console.error( 'Username does not exist.' );
        return { error: 'Username does not exist'} 
    }

    const { data: tapes, error: tapesError } = await supabase.rpc('get_tapes_by_user_id', { useridquery: user.uuid });

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return {tapes};
}