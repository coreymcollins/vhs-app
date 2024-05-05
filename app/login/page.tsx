'use client'

import { useState } from 'react'
import { login, signup } from '../login/actions'

export default function LoginPage() {
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
    const [signupErrorMessage, setSignupErrorMessage] = useState<string>('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData( event.currentTarget )

        const error = await login( formData )

        if ( error ) {
            setLoginErrorMessage( error.message )
        }
    }

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData( event.currentTarget )

        const error = await signup( formData )

        if ( error ) {
            setSignupErrorMessage( error.message )
        }
    }

    return (
        <>
            <h2>Log in to your account</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button type="submit">Log in</button>
            </form>
            { loginErrorMessage && <p>{loginErrorMessage}</p>}

            <h2>Register a new account</h2>
            <form onSubmit={handleSignup}>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button type="submit">Sign up</button>
            </form>
            { signupErrorMessage && <p>{signupErrorMessage}</p>}
        </>
    )
}