'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createEntry } from '@/app/actions'

const initialState = {
    message: 'All fields are required.',
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button type="submit" aria-disabled={pending}>
            Add
        </button>
    )
}

export function AddForm() {
    const [state, formAction] = useFormState( createEntry, initialState );

    return (
        <form action={formAction}>
            <label htmlFor="barcode">Barcode</label>
            <input type="text" id="barcode" name="barcode" required />
            
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
            
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" required />
            
            <label htmlFor="genre">Genre</label>
            <input type="text" id="genre" name="genre" required />
            
            <label htmlFor="year">Year</label>
            <input type="number" id="year" name="year" required />
            
            <SubmitButton />
            
            <p aria-live="polite" role="status">
                {state?.message}
            </p>
        </form>
    )
}