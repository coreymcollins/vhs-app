'use client'

import RegisterUserForm from '../components/forms/register-user';
import { useEffect } from 'react';

export default function LoginPage() {

    useEffect(() => {
        document.title = 'Revival Video: Register';
        
        const metaDescription = document.querySelector( 'meta[name="description"]' );
        if ( metaDescription ) {
            metaDescription.setAttribute( 'content', 'Be kind. Revive.' );
        } else {
            const meta = document.createElement( 'meta' );
            meta.name = 'description';
            meta.content = 'Be kind. Revive.';
            document.head.appendChild(meta);
        }
    }, []);
    
    return (
        <>
            <div className="page-section container-narrow">
                <div className="page-content-header">
                    <h2>Register a new account</h2>
                </div>
                <RegisterUserForm />
            </div>
        </>
    )
}