import { createClient } from '@/utils/supabase/server'

let cachedUser: any = null

export async function checkLoginStatus() {

    if ( cachedUser ) {
        return cachedUser;
    }
    
    const supabase = createClient()
    
    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if ( ! user ) {
        return null
    }

    let userRole: string
    userRole = ''
    
    const { data, error } = await supabase
        .from( 'users' )
        .select( 'user_role' )
        .eq( 'uuid', user.id )

    if ( error ) {
        console.error( 'Error getting user:', error )
        return null;
    }
    
    userRole = data && data[0] ? data[0].user_role : ''
    
    cachedUser = { ...user, userRole } || null

    return cachedUser;
}

export function resetCachedUser() {
    cachedUser = null
}