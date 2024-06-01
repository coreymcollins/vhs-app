'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()
    
    const userCreds = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    
    const { data: user, error } = await supabase.auth.signInWithPassword( userCreds )

    if ( error ) {
        return { status: 'error', message: error.message }
    }
    
    revalidatePath('/', 'layout')
    return { status: 'success', user }
}

export async function signup(formData: FormData) {
    const supabase = createClient()
    
    const { data: newUser, error } = await supabase.auth.signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                user_role: 'user',
                username: formData.get( 'username' ) as string,
            }
        }
    })

    if ( error ) {
        return {message: error.message}
    }

    revalidatePath('/', 'layout')
    redirect('/')
}