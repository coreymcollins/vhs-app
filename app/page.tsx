import { SearchForm } from './components/search-form'
import { BarcodeScanQuagga } from './components/search-form-scan-quagga'
import Link from 'next/link'

export default async function Home() {   
    return (
        <main>
            <h1>VHS Library</h1>

            <div className="page-section">
                <h2>Current library</h2>
                <Link href="/library">View Full Library</Link>
            </div>

            <div className="page-section">
                <h2>Search for an existing tape by keyword</h2>
                <SearchForm />
            </div>

            <div className="page-section">
                <h2>Search for an existing tape by barcode</h2>
                <BarcodeScanQuagga />
            </div>
        </main>
    )
}