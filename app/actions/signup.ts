'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()
    
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    
    const { error } = await supabase.auth.signInWithPassword(data)

    if ( error ) {
        return {message: error.message}
    }
    
    revalidatePath('/', 'layout')
    redirect('/')
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