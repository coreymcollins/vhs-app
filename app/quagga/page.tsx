import { getCurrentUserSupabaseAuth } from '../actions'
import { BarcodeScanQuagga } from '../components/search-form-scan-quagga'

export default async function QuaggaPage() {
    const userAuth = await getCurrentUserSupabaseAuth()

    return (
        <>
            <h2>Search for an existing tape with quagga</h2>
            <BarcodeScanQuagga session={userAuth} />
        </>
    );
}
