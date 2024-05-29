'use client'

import { useEffect } from 'react';
import LoginUserForm from '../components/forms/login-user';

export default function LoginPage() {

    useEffect(() => {
        document.title = 'Revival Video: Login';
        
        const metaDescription = document.querySelector( 'meta[name="description"]' );
        if ( metaDescription ) {
            metaDescription.setAttribute( 'content', 'Sign in to your Revival Video account.' );
        } else {
            const meta = document.createElement( 'meta' );
            meta.name = 'description';
            meta.content = 'Sign in to your Revival Video account.';
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <>
            <div className="page-section container-narrow">
                <div className="page-content-header">
                    <h2>Sign in to your account</h2>
                </div>
                <LoginUserForm />
            </div>
        </>
    )
}