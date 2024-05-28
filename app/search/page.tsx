import { SearchForm } from '@/app/components/search-form'
import { checkLoginStatus } from '../actions/check-login-status'
import { BarcodeScanQuagga } from '../components/search-form-scan-quagga'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Revival Video: Search',
    description: 'Search for a tape in the Revival Video Library.',
};

export default async function SearchPage( req: any ) {
    const userAuth = await checkLoginStatus()
    
    return (
        <>
            <div className="page-content-header">
                <h2>Search for a tape</h2>
            </div>

            <div className="page-section">
                <h3>Search for an existing tape</h3>
                <SearchForm session={userAuth} req={req} />
            </div>
            <div className="page-section">
                <h3>Search for an existing tape by barcode</h3>
                <BarcodeScanQuagga session={userAuth} req={req} />
            </div>
        </>
    )
}