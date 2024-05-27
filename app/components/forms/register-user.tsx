import { checkForUserByUsername } from '@/app/actions';
import { signup } from '@/app/actions/signup';
import { useState } from 'react'

export default function RegisterUserForm() {
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
                console.error( 'Error in registering:', error )
                setSignupErrorMessage( error.message )
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSignup} className="form add-form">
                <div className="form-row">
                    <label htmlFor="email">Email:</label>
                    <input id="email" name="email" type="email" required />
                </div>
                <div className="form-row">
                    <label htmlFor="username">Username:</label>
                    <input id="username" name="username" type="text" required />
                </div>
                <div className="form-row">
                    <label htmlFor="password">Password:</label>
                    <input id="password" name="password" type="password" required />
                </div>
                <div className="form-row form-row-single">
                    <button type="submit">Sign up</button>
                </div>
                <div className="form-row form-row-single">
                    { signupErrorMessage && <p aria-live="polite" role="status" className="form-message">{signupErrorMessage}</p>}
                </div>
            </form>
        </>
    )
}