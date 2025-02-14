'use client'

import { createClient } from '@/utils/supabase/client';
import { useEffect, useRef, useState } from 'react'
import { checkForUserByUsername } from '@/app/queries/checkForUserByUsername';

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
    const [success, setSuccess] = useState<string>( '' )
    const successTimeoutRef = useRef<NodeJS.Timeout | null>( null )
    let fieldType = 'password' === name ? 'password' : 'text'
    const supabase = createClient()

    useEffect(() => {
        return () => {
            if ( successTimeoutRef.current ) {
                clearTimeout( successTimeoutRef.current )
            }
        }
    }, [])

    const handleSave = async () => {
        let error = null

        if ( 'email' === name ) {
            const { data, error: emailError } = await supabase.auth.updateUser({
                email: inputValue
            })
            error = emailError
        } else if ( 'username' === name ) {
            const usernameExists = await checkForUserByUsername( inputValue )

            if ( usernameExists ) {
                setError( 'Username already exists' )
                return
            }

            const { data, error: usernameError } = await supabase.auth.updateUser({
                data: {username: inputValue}
            })
            error = usernameError
        } else if ( 'password' === name ) {
            const { data, error: passwordError } = await supabase.auth.updateUser({
                password: inputValue
            })
            error = passwordError
        } 

        if ( error ) {
            setError( error.message )
            console.error( `Error updating ${name}`, error.message )
        } else {
            setValue( inputValue )
            setIsEditing( false )
            setSuccess( `Successfully updated ${name}` )

            if ( successTimeoutRef.current ) {
                clearTimeout( successTimeoutRef.current )
            }

            successTimeoutRef.current = setTimeout(() => {
                setSuccess( '' )
            }, 2000 )
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
                            <button type="submit" className="button button-save button-padding">Save</button>
                            <button type="button" onClick={() => { setIsEditing( false ); setInputValue( initialValue ); setError( '' ) }} className="button button-cancel button-padding">Cancel</button>
                        </form>
                    ) : (
                        <>
                            { 'password' === fieldType ? (
                                <input type="password" id={name} name={name} className="readonly" maxLength={30} readOnly value="••••••••••••" />
                            ) : (
                                <input type={fieldType} id={name} name={name} className="readonly" maxLength={30} readOnly defaultValue={value} />
                            )}
                            <button type="button" onClick={() => setIsEditing( true )} className="button button-edit button-padding">Edit</button>
                        </>
                    )}
                </div>
            </div>
            { isEditing && error && (
                <div className="form-row-error-message">
                    <p aria-live="polite" role="status" className="message-response message-error">{error}</p>
                </div>
            )}

            { success && (
                <div className="form-row-error-message">
                    <p aria-live="polite" role="status" className="message-response message-success">{success}</p>
                </div>
            )}
        </div>
    )
}

export default EditableField