'use client'

import EditableField from '../components/editable-field'
import { useUser } from '@/app/contexts/UserContext'

export default function AccountClient() {
    const user = useUser()

    if ( ! user ) {
        return (
            <div className="page-section container-narrow">
                <div className="page-content-header">
                    <h2>No User Logged In</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="page-section container-narrow">
            <div className="page-content-header">
                <h2>Account Details</h2>
            </div>
            <EditableField
                label="Email"
                name="email"
                type="email"
                value={user.email}
                userId={user.id}
            />
            <EditableField
                label="Username"
                name="username"
                type="string"
                value={user.user_metadata.username}
                userId={user.id}
            />
            <EditableField
                label="Password"
                name="password"
                type="password"
                value=''
                userId={user.id}
            />
        </div>
    )
}
