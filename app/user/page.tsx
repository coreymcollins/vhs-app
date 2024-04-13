import LoginForm from '../components/login-form'
import { AddUser } from '../components/add-user'

export default async function SearchPage() {
    
    return (
        <main>
            <h1>VHS Library</h1>

            <LoginForm />
            <AddUser />
        </main>
    )
}