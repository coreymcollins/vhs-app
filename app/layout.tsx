import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PageHeader from './components/header';
import { checkLoginStatus } from './actions/check-login-status';
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
                <PageHeader user={user} />
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}