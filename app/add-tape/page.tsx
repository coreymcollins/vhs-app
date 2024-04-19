import { AddForm } from '../components/add-tape'
import PageHeader from '../components/header'

export default async function AddTapePage() {
    
    return (
        <main>
            <PageHeader />

            <h2>Add new tape</h2>
            <AddForm />
        </main>
    )
}