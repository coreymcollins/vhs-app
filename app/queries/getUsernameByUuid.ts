'use server'

import { createClient } from '@/utils/supabase/server';

export async function getUsernameByUuid( uuid: string ) {

    if ( ! uuid ) {
        return;
    }

    const supabase = createClient()

    const { data: user, error } = await supabase
        .from( 'users' )
        .select( 'username' )
        .eq( 'uuid', uuid )
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

    return user.username
}