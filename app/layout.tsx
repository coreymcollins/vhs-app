import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { UserProvider } from './contexts/UserContext'
import ClientComponentWrapper from './components/ClientComponentWrapper'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Revival Video',
    description: 'Be kind. Revive.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

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
                <UserProvider>
                    <NextTopLoader
                        color="#ffffff"
                    />
                    <ClientComponentWrapper>
                        {children}
                    </ClientComponentWrapper>
                    <SpeedInsights />
                    <Analytics />
                </UserProvider>
            </body>
        </html>
    );
}