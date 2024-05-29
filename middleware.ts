import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { checkLoginStatus } from '@/app/actions/check-login-status'

export async function middleware(request: NextRequest) {
    
    // update user's auth session
    await updateSession(request)
    
    const redirectUrls = [
        '/add-tape',
        '/collection',
        '/edit',
        '/register',
    ]

    const loggedInRedirectUrls = [
        '/login',
    ];

    const isLoggedIn = await checkLoginStatus();

    const { pathname } = request.nextUrl;

    if ( isLoggedIn ) {
        // If the user is logged in and tries to access the /login page, redirect them
        if ( loggedInRedirectUrls.some( url => pathname === url ) ) {
            return NextResponse.redirect( new URL( '/account', request.url ) );
        }
    } else {
        // If the user is not logged in, check for restricted paths
        if (
            redirectUrls.some( url => pathname === url ) ||
            // Check for all other paths that should start with the given prefix
            redirectUrls.filter( url => url !== '/collection' ).some( url => pathname.startsWith( url ) )
        ) {
            return NextResponse.redirect( new URL( '/login', request.url ) );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * Feel free to modify this pattern to include more paths.
        */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}