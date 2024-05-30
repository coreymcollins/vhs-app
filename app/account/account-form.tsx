import { useRouter } from 'next/navigation'

export default function AccountForm() {
    const router = useRouter()

    const handleLogout = async ( event: React.FormEvent ) => {
        event.preventDefault()

        const response = await fetch( '/auth/signout', {method: 'POST'})

        if ( response.ok ) {
            window.location.href = '/login'
        } else {
            console.error( 'Failed to log out' )
        }
    }
    
    return (
        <div>
            <form onSubmit={handleLogout} method="post">
                <button className="button block" type="submit">
                    Sign out
                </button>
            </form>
        </div>
    )
}