import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { checkLoginStatus, resetCachedUser } from '../../actions/check-login-status'

export async function POST(req: NextRequest) {
    const supabase = createClient()
    const user = await checkLoginStatus()
    
    if ( user && null !== user ) {
        await supabase.auth.signOut()
        resetCachedUser()
    }
    
    revalidatePath( '/', 'layout' )

    const response = NextResponse.redirect(new URL( '/login', req.url ), {
        status: 302,
    })

    response.headers.set( 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, private' )

    return response
}