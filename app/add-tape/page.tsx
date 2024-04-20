import { AddForm } from '../components/add-tape'
import { options } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AddTapePage() {

    const session = await getServerSession( options )

    if ( ! session ) {
        redirect( '/api/auth/signin?callbackUrl=/add-tape' )
    }

    return (
        <>
            <h2>Add new tape</h2>
            <AddForm />
        </>
    )
}