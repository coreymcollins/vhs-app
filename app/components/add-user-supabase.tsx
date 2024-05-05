'use client'

import { useState } from 'react';
import { createClient } from '@/utils/supabase/server';

const supabase = createClient()

const initialState = {
    message: 'All fields are required.',
};

export function AddUserSupabase() {
    const [state, setState] = useState(initialState);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const email = formData.get( 'emailsb' ) as string;
        const password = formData.get( 'passwordsb' ) as string;

        try {
            let { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            })

            if ( error ) {
                throw error;
            }

            if ( data ) {
                setState({ message: 'User created successfully' })
            } else if ( ! data ) {
                setState({ message: 'User not created' })
            }
        } catch ( error ) {
            setState({ message: 'User could not be added' })
        }
    };

    return (
        <>
            <h2>Add New User to supabase</h2>
            <form onSubmit={handleSubmit} className="add-form form">
                <label htmlFor="emailsb">Email</label>
                <input type="email" id="emailsb" name="emailsb" required />
                
                <label htmlFor="passwordsb">Password</label>
                <input type="password" id="passwordsb" name="passwordsb" required />

                <button type="submit">Add User</button>
                
                <p aria-live="polite" role="status">
                    {state.message}
                </p>
            </form>
        </>
    );
}
