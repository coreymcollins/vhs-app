import { getServerSession } from 'next-auth'
import { SearchForm } from './components/search-form'
import { BarcodeScanQuagga } from './components/search-form-scan-quagga'
import { options } from './api/auth/[...nextauth]/options'

export default async function Home() {
    const session = await getServerSession( options )

    return (
        <>
            <div className="page-section">
                <h2>Search for an existing tape by keyword</h2>
                <SearchForm session={session} />
            </div>

            <div className="page-section">
                <h2>Search for an existing tape by barcode</h2>
                <BarcodeScanQuagga session={session} />
            </div>
        </>
    )
}