'use server'

import { createClient } from '@/utils/supabase/server';

export async function checkForUserByUsername( username: any ) {

    if ( ! username ) {
        return null
    }

    const supabase = createClient()

    const { data: user, error } = await supabase
        .from( 'users' )
        .select( 'username' )
        .eq( 'username', username )
        .maybeSingle()
    
    if ( error ) {
        console.error( 'Error fetching user:', error.message );
        return null;
    }

    if ( null === user ) {
        return null
    }

    if ( null === user.username ) {
        return null
    }

    return true
}