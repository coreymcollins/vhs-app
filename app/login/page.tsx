'use client'

import LoginUserForm from '../components/forms/login-user';

export default function LoginPage() {

    return (
        <>
            <div className="page-content-header">
                <h2>Log in to your account</h2>
            </div>
            <LoginUserForm />
        </>
    )
}