import { AddUser } from '../components/add-user'
import { options } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { checkForAdmin } from '../actions/sign-in'
import { AddUserSupabase } from '../components/add-user-supabase'

export default async function UserPage() {

    const session = await getServerSession( options )

    if ( ! session || undefined !== session.user && !( await checkForAdmin( session.user.name ?? '' ) ) ) {
        redirect( '/api/auth/signin?callbackUrl=/user' )
    }

    return (
        <>
            <AddUser />
            <AddUserSupabase />
        </>
    )
}