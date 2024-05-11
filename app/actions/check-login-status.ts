import { createClient } from '@/utils/supabase/server'

let cachedUser: any = null

export async function checkLoginStatus() {

    if ( cachedUser ) {
        console.log( 'the user is cached!', cachedUser )
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

    console.log( 'the user is not yet cached', cachedUser )

    return cachedUser;
}