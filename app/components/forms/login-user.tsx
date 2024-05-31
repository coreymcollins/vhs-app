import { useState } from 'react'
import { login } from '@/app/actions/signup'
import { useSetUser } from '@/app/contexts/UserContext';
import { createClient } from '@/utils/supabase/client'

export default function LoginUserForm() {
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
    const setUser = useSetUser()

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData( event.currentTarget )

        const error = await login( formData )

        if ( error ) {
            setLoginErrorMessage( error.message )
        } else {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser( user )
        }
    }

    return (
        <form onSubmit={handleLogin} className="form add-form">
            <div className="form-row">
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
            </div>
            <div className="form-row">
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
            </div>
            <div className="form-row form-row-single">
                <button type="submit">Sign in</button>
            </div>
            <div className="form-row form-row-single">
                { loginErrorMessage && <p aria-live="polite" role="status" className="form-message">{loginErrorMessage}</p>}
            </div>
        </form>
    )
}