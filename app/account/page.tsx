import { createClient } from '@/utils/supabase/server'
import EditableField from '../components/editable-field'

export default async function Account() {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()

    if ( ! user ) {
        return
    }

    return (
        <>
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
        </>
    )
}