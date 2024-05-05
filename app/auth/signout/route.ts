import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function checkLoginStatus() {
    
    const supabase = createClient()
    
    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user;
}

export async function POST(req: NextRequest) {
    const supabase = createClient()
    const user = await checkLoginStatus()
    
    if ( user ) {
        await supabase.auth.signOut()
    }
    
    revalidatePath('/', 'layout')
    return NextResponse.redirect(new URL('/login', req.url), {
        status: 302,
    })
}