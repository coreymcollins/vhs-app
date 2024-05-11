import { checkLoginStatus } from './actions/check-login-status'
import { SearchForm } from './components/search-form'
import { BarcodeScanQuagga } from './components/search-form-scan-quagga'

export default async function Home() {
    const userAuth = await checkLoginStatus()

    return (
        <>
            <div className="page-section">
                <h2>Search for an existing tape by keyword</h2>
                <SearchForm session={userAuth} />
            </div>

            <div className="page-section">
                <h2>Search for an existing tape by barcode</h2>
                <BarcodeScanQuagga session={userAuth} />
            </div>
        </>
    )
}