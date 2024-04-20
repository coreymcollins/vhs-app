import { BarcodeScanQuagga } from '../components/search-form-scan-quagga';

export default async function QuaggaPage() {
    return (
        <>
            <h2>Search for an existing tape with quagga</h2>
            <BarcodeScanQuagga />
        </>
    );
}
