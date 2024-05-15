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

    cachedUser = user || null

    return cachedUser;
}

export function resetCachedUser() {
    cachedUser = null
}