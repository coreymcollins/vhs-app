import Link from 'next/link'
import Image from 'next/image'
import { options } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'

export default async function PageHeader() {
    const session = await getServerSession( options )

    return (
        <header className="site-header">
            <Link href="/">
                <Image
                    src="/revival.webp"
                    priority
                    width={640}
                    height={84}
                    alt="Revival Video logo"
                    className="site-logo"
                />
            </Link>
            <h1>Revival Video VHS Library</h1>

            { session && undefined !== session.user ? (
                `signed in as ${session?.user.name} `
                ) : (
                'not signed in '
            )}

            <Link href="/add-tape">Add Tape</Link>
        </header>
    )
}
