// components/AccountForm.tsx
import { useRouter } from 'next/navigation'
import { useSetUser } from '@/app/contexts/UserContext'

export default function AccountForm() {
    const setUser = useSetUser()
    const router = useRouter()
    
    const handleLogout = async ( event: React.FormEvent ) => {
        event.preventDefault()
        
        const response = await fetch( '/auth/signout', { method: 'POST' } )
        
        if ( response.ok ) {
            setUser( null )
            router.push( '/login' )
        } else {
            console.error( 'Failed to log out' )
        }
    }
    
    return (
        <div>
            <form onSubmit={handleLogout}>
                <button className="button block" type="submit">
                    Sign out
                </button>
            </form>
        </div>
    )
}
