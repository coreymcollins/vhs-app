import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { checkLoginStatus, resetCachedUser } from '../../actions/check-login-status'

export async function POST(req: NextRequest) {
    const supabase = createClient()
    const user = await checkLoginStatus()
    
    if ( user ) {
        await supabase.auth.signOut()
        resetCachedUser()
    }
    
    revalidatePath( '/', 'layout' )
    return NextResponse.redirect(new URL( '/login', req.url ), {
        status: 302,
    })
}