import { checkLoginStatus } from '../actions/check-login-status';
import { BarcodeScanQuagga } from '../components/search-form-scan-quagga'

export default async function QuaggaPage( req: any ) {
    const userAuth = await checkLoginStatus()

    return (
        <>
            <div className="page-content-header">
                <h2>Search for an existing tape with quagga</h2>
            </div>
            <BarcodeScanQuagga session={userAuth} req={req} />
        </>
    );
}
