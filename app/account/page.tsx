import { Metadata } from 'next';
import AccountClient from './AccountClient';

export const metadata: Metadata = {
    title: 'Revival Video: My Account',
    description: 'Edit your Revival Video account details.',
};

export default function Account() {
    return <AccountClient />
}
