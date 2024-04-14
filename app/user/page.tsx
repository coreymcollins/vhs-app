import LoginForm from '../components/login-form'
import { AddUser } from '../components/add-user'
import PageHeader from '../components/header'

export default async function UserPage() {
    
    return (
        <main>
            <PageHeader />

            <LoginForm />
            <AddUser />
        </main>
    )
}