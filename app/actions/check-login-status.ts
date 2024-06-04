import { createClient } from '@/utils/supabase/server'

let cachedUser: any = null

export async function checkLoginStatus() {

    const supabase = createClient()
    
    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if ( ! user ) {
        return null
    }

    return user
}

export function resetCachedUser() {
    cachedUser = null
}