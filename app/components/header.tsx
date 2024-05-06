import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUserSupabaseAuth } from '../actions'
import { createClient } from '@/utils/supabase/server';
import { checkLoginStatus } from '../actions/check-login-status';
import AccountForm from '../account/account-form'


export default async function PageHeader() {
    const supabase = createClient()
    const userAuth = await getCurrentUserSupabaseAuth()
    const isLoggedIn = await checkLoginStatus()
    let userRole: string | null
    userRole = ''

    if ( null !== isLoggedIn ) {

        const { data, error } = await supabase
            .from( 'users' )
            .select( 'user_role' )
            .eq( 'uuid', isLoggedIn.id )

        userRole = null !== data && undefined !== data[0] ? data[0].user_role : ''
    }
    
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
                    { null !== isLoggedIn ? (
                        <>
                            <li><Link href="/collection">My Library</Link></li>
                            { 'admin' === userRole ? (
                                <li><Link href="/add-tape">Add Tape</Link></li>
                            ) : null }
                        </>
                        ) : (
                            <>
                            <li><Link href="/login">Sign In</Link></li>
                        </>
                    )}
                </ol>
                { null !== isLoggedIn ? (
                    <AccountForm />
                ) : (
                    ''
                )}
            </nav>
            
            { null !== userAuth ? (
                    <p>signed in as user {userAuth.email}</p>
                ) : (
                    <p>not signed in as user</p>
                )
            }
        </header>
    )
}
