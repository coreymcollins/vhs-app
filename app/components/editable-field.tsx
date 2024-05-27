'use client'

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react'

interface EditableFieldProps {
    label: string;
    name: string;
    type: string;
    value: any;
    userId: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, name, type, value: initialValue, userId }) => {
    const [isEditing, setIsEditing] = useState( false )
    const [inputValue, setInputValue] = useState( initialValue )
    const [value, setValue] = useState( initialValue )
    const [error, setError] = useState<string>( '' )
    const supabase = createClient()

    const handleSave = async () => {
        let error = null

        if ( 'email' === name ) {
            const { data, error: emailError } = await supabase.auth.updateUser({
                email: inputValue
            })
            error = emailError
        } else if ( 'username' === name ) {
            const { data, error: usernameError } = await supabase.auth.updateUser({
                data: {username: inputValue}
            })
            error = usernameError
        } else if ( 'password' === name ) {
            const { data, error: passwordError } = await supabase.auth.updateUser({
                password: inputValue,
                nonce: '123456'
            })
            error = passwordError
        } 

        if ( error ) {
            setError( error.message )
            console.error( `Error updating ${name}`, error.message )
        } else {
            setValue( inputValue )
            setIsEditing( false )
        }
    }

    return (
        <div className="form">

            <div className="form-row form-row-editable">
                <label htmlFor={name}>{label}</label>
                <div className="editable-fields-row">
                    { isEditing ? (
                        <form className="form" onSubmit={(e) => {e.preventDefault(); handleSave();}}>
                            <input
                                id={name}
                                type={type}
                                value={inputValue}
                                onChange={(e) => setInputValue( e.target.value )}
                                required
                            />
                            <button type="submit" className="button-save button-padding">Save</button>
                            <button type="button" onClick={() => { setIsEditing( false ); setInputValue( initialValue ); setError( '' ) }} className="button-cancel button-padding">Cancel</button>
                        </form>
                    ) : (
                        <>
                            { value && (
                                <>
                                    <div className="editable-fields-value">{value}</div>
                                </>
                            )}
                            <button type="button" onClick={() => setIsEditing( true )} className="button-edit button-padding">Edit</button>
                        </>
                    )}
                </div>
            </div>
            { isEditing && error && (
                <div className="form-row-error-message">
                    <p aria-live="polite" role="status" className="error-message">{error}</p>
                </div>
            )}
        </div>
    )
}

export default EditableField