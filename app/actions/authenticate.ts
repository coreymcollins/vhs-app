'use server'

import { signIn, UserData } from '@/app/actions/sign-in'

export interface AuthError {
    type: string;
    message: string;
}

export async function authenticate(_currentState: unknown, formData: FormData): Promise<UserData | null> {

    try {
        const userData: UserData = await signIn('credentials', formData)
        return userData
    } catch (error) {
        const authError: AuthError = {
            type: 'CredentialsSignIn',
            message: 'Invalid credentials'
        }
        
        return null
    }
}