import { AddForm } from '../components/add-tape'
import { options } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { checkForAdmin } from '../actions/sign-in'

export default async function AddTapePage() {
    const session = await getServerSession( options )

    if ( ! session || undefined !== session.user && !( await checkForAdmin( session.user.name ?? '' ) ) ) {
        redirect( '/api/auth/signin?callbackUrl=/add-tape' )
    }

    return (
        <>
            <h2>Add new tape</h2>
            <AddForm />
        </>
    )
}