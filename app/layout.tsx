import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PageHeader from './components/header';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Revival Video",
    description: "Be kind. Revive.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                <main>
                    <PageHeader />
                    {children}
                </main>
            </body>
        </html>
    );
}
    