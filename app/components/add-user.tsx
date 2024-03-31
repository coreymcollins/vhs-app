'use client'

import { useState } from 'react';
import { createUser } from '@/app/actions/create-user';

const initialState = {
    message: 'All fields are required.',
};

export function AddUser() {
    const [state, setState] = useState(initialState);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        
        try {
            const message = await createUser(formData);
            setState({ message: message });
        } catch (error) {
            setState({ message: 'Error adding user.' });
        }
    };

    return (
        <>
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit} className="add-form form">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
                
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
                
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />

                <button type="submit">Add User</button>
                
                <p aria-live="polite" role="status">
                    {state.message}
                </p>
            </form>
        </>
    );
}
