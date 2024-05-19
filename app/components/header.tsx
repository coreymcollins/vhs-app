import Link from 'next/link'
import Image from 'next/image'
import AccountForm from '../account/account-form'

interface PageHeaderProps {
    user: any;
}

export default async function PageHeader({user}: PageHeaderProps) {
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

            <nav className="menu">
                <ol>
                    <li><Link href="/library">Full Library</Link></li>
                    <li><Link href="/search">Search</Link></li>
                    { null !== user ? (
                        <>
                            <li><Link href="/collection">My Library</Link></li>
                            { 'admin' === user.userRole ? (
                                <li><Link href="/add-tape">Add Tape</Link></li>
                            ) : null }
                        </>
                        ) : (
                            <>
                            <li><Link href="/login">Sign In</Link></li>
                        </>
                    )}
                </ol>
            </nav>
            
            { null !== user ? (
                <>
                    <p>signed in as {user.email}</p>
                    <AccountForm />
                </>
                ) : (
                <p>not signed in</p>
            )}
        </header>
    )
}
