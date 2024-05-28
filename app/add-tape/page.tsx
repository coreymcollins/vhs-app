import { Metadata } from 'next';
import { AddForm } from '../components/add-tape'

export const metadata: Metadata = {
    title: 'Revival Video: Add Tape',
    description: 'Be kind. Revive.',
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