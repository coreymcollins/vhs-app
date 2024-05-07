'use client'

import { useState } from 'react'
import { signup } from '@/app/login/actions'

export default function LoginPage() {
    const [signupErrorMessage, setSignupErrorMessage] = useState<string>('');

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