import { createClient } from '@/utils/supabase/server'

export async function checkLoginStatus() {
    
    const supabase = createClient()
    
    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user;
}