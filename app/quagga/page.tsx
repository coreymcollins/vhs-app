import { BarcodeScanQuagga } from '../components/search-form-scan-quagga';
import PageHeader from '../components/header';

export default async function QuaggaPage() {
    return (
        <main>
            <PageHeader />
            
            <h2>Search for an existing tape with quagga</h2>
            <BarcodeScanQuagga />
        </main>
    );
}
