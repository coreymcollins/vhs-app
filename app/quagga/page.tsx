import { checkLoginStatus } from '../actions/check-login-status';
import { BarcodeScanQuagga } from '../components/search-form-scan-quagga'

export default async function QuaggaPage() {
    const userAuth = await checkLoginStatus()

    return (
        <>
            <h2>Search for an existing tape with quagga</h2>
            <BarcodeScanQuagga session={userAuth} />
        </>
    );
}
