import LoginForm from '../components/login-form'
import { AddUser } from '../components/add-user'
import Link from 'next/link'

export default async function UserPage() {
    
    return (
        <main>
            <h1><Link href="/">VHS Library</Link></h1>

            <LoginForm />
            <AddUser />
        </main>
    )
}