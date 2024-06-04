'use client'

import Link from 'next/link'
import Image from 'next/image'
import AccountForm from '../account/account-form'
import { useEffect, useState } from 'react';

interface PageHeaderProps {
    user: any;
}

const PageHeader: React.FC<PageHeaderProps> = ({ user }) => {
    const [scrolled, setScrolled] = useState( false )
    let metadata = null !== user ? user.user_metadata : {}

    useEffect(() => {
        const handleScroll = () => {
            if ( window.scrollY > 0 ) {
                setScrolled( true )
            } else {
                setScrolled( false )
            }
        }
        
        window.addEventListener( 'scroll', handleScroll )
    
        return () => {
            window.removeEventListener( 'scroll', handleScroll )
        }
    }, [])

    return (
        <header id="site-header" className={`site-header${scrolled ? ' scrolled' : ''}`}>
            <h1 className="screen-reader-only">Revival Video VHS Library</h1>
            <div className="menu-containers">
                <div className="home">
                    <Link href="/">
                        { scrolled ? (
                            <Image
                            src="/revival-logomark.webp"
                            priority
                            width={61}
                            height={37}
                            alt="Revival Video logomark"
                            className="site-logomark"
                            />
                        ) : (
                            <Image
                                src="/revival.webp"
                                priority
                                width={282}
                                height={37}
                                alt="Revival Video logo"
                                className="site-logo"
                            />
                        )}
                    </Link>
                </div>
                <nav className="menu menu-navigation">
                    <ul className="menu-navigation-list">
                        <li><Link href="/library">Library</Link></li>
                        <li><Link href="/search">Search</Link></li>
                        { null !== user && (
                            <>
                                <li><Link href="/collection">Collection</Link></li>
                                { 'admin' === metadata.user_role && (
                                    <li><Link href="/add-tape">Add Tape</Link></li>
                                )}
                            </>
                        )}
                    </ul>
                </nav>
                <nav className="menu menu-user">
                    <ul className="menu-user-list">
                        { null !== user ? (
                            <>
                                <li>{metadata.username}</li>
                                <li><Link href="/account">Account</Link></li>
                                <li><AccountForm /></li>
                            </>
                            ) : (
                            <>
                                <li><Link href="/login">Sign In</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default PageHeader