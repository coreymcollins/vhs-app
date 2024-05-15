import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PageHeader from './components/header';
import { checkLoginStatus } from './actions/check-login-status';
import { createClient } from '@/utils/supabase/server';
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Revival Video",
    description: "Be kind. Revive.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let user = await checkLoginStatus()
    let userRole: string
    userRole = ''
    
    if ( null !== user ) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from( 'users' )
            .select( 'user_role' )
            .eq( 'uuid', user.id )

        if ( error ) {
            console.error( 'Error getting user:', error )
            return null;
        }
        
        userRole = data && data[0] ? data[0].user_role : ''
    }

    return (
        <html lang="en">
            <link
                rel="icon"
                href="/icon?<generated>"
                type="image/<generated>"
                sizes="<generated>"
            />
            <link
                rel="apple-touch-icon"
                href="/apple-icon?<generated>"
                type="image/<generated>"
                sizes="<generated>"
            />
            <body className={inter.className}>
                <NextTopLoader
                    color="#ffffff"
                />
                <main>
                    <PageHeader user={user} userRole={userRole} />
                    {children}
                </main>
            </body>
        </html>
    );
}