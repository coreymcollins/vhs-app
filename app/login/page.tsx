'use client'

import { useState } from 'react'
import { login } from './actions'

export default function LoginPage() {
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData( event.currentTarget )

        const error = await login( formData )

        if ( error ) {
            setLoginErrorMessage( error.message )
        }
    }

    return (
        <>
            <div className="page-content-header">
                <h2>Log in to your account</h2>
            </div>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button type="submit">Log in</button>
            </form>
            { loginErrorMessage && <p>{loginErrorMessage}</p>}
        </>
    )
}