import { Metadata } from 'next';
import { AddForm } from '../components/add-tape'

export const metadata: Metadata = {
    title: 'Revival Video: Add Tape',
    description: 'Add a new tape to the Revival Video Library.',
};

export default async function AddTapePage() {

    return (
        <>
            <div className="page-content-header">
                <h2>Add new tape</h2>
            </div>
            <AddForm />
        </>
    )
}