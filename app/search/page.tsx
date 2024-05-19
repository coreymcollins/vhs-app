import { SearchForm } from '@/app/components/search-form'
import { checkLoginStatus } from '../actions/check-login-status'
import { BarcodeScanQuagga } from '../components/search-form-scan-quagga'

export default async function SearchPage( req: any ) {
    const userAuth = await checkLoginStatus()
    
    return (
        <>
            <div className="page-section">
                <h2>Search for an existing tape</h2>
                <SearchForm session={userAuth} req={req} />
            </div>
            <div className="page-section">
                <h2>Search for an existing tape by barcode</h2>
                <BarcodeScanQuagga session={userAuth} req={req} />
            </div>
        </>
    )
}