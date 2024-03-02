'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createEntry } from '@/app/actions'

const initialState = {
    message: '',
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
            <label htmlFor="title">Add Tape</label>
            <input type="text" id="title" name="title" required />
            <SubmitButton />
            <p aria-live="polite" role="status">
                {state?.message}
            </p>
        </form>
    )
}