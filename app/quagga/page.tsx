import { getServerSession } from 'next-auth';
import { BarcodeScanQuagga } from '../components/search-form-scan-quagga';
import { options } from '../api/auth/[...nextauth]/options';

export default async function QuaggaPage() {
    const session = await getServerSession( options )

    return (
        <>
            <h2>Search for an existing tape with quagga</h2>
            <BarcodeScanQuagga session={session} />
        </>
    );
}
