'use client'

import { useState } from 'react'
import { UserData } from '@/app/actions/sign-in'
import { authenticate, AuthError } from '@/app/actions/authenticate'

export default function LoginForm() {
    const [message, setMessage] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        try {
            const userData: UserData | null = await authenticate(null, formData)
            
            if (userData) {
                setMessage(`Welcome, ${userData.email}`)
            } else {
                setMessage('Invalid credentials')
            }
        } catch (error) {
                setMessage('Something went wrong')
        }
    }
    
    return (
        <>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Log In</button>
            </form>
            <p>{message}</p>
        </>
    )
}