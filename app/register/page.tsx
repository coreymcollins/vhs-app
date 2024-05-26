'use client'

import { useState } from 'react'
import { signup } from '@/app/login/actions'
import { checkForUserByUsername } from '../actions';

export default function LoginPage() {
    const [signupErrorMessage, setSignupErrorMessage] = useState<string>('');

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData( event.currentTarget )
        const usernameExists = await checkForUserByUsername( formData.get( 'username' ) )

        if ( true === usernameExists ) {
            setSignupErrorMessage( `Username ${formData.get( 'username' )} already exists` )
        } else {
            const error = await signup( formData )
    
            if ( error ) {
                console.log( 'error', error )
                setSignupErrorMessage( error.message )
            }
        }
    }

    return (
        <>
            <div className="page-content-header">
                <h2>Register a new account</h2>
            </div>
            <form onSubmit={handleSignup}>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="username">Username:</label>
                <input id="username" name="username" type="text" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button type="submit">Sign up</button>
            </form>
            { signupErrorMessage && <p>{signupErrorMessage}</p>}
        </>
    )
}