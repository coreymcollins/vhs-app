'use client'

import { useEffect, useState } from 'react'
import { getAllDistributors } from '@/app/queries/getAllDistributors'

interface Distributor {
    distributor_id: number;
    distributor_name: string;
}

export default function FetchDistributors() {
    const [distributors, setDistributors ] = useState<Distributor[]>([]);
    
    useEffect(() => {
        async function fetchDistributors() {
            try {
                const distributorsData = await getAllDistributors()

                if ( distributorsData ) {
                    setDistributors( distributorsData )
                }
            } catch ( error ) {
                console.error( 'Failed to fetch distributors', error )
            }
        }
    
        fetchDistributors()
    }, [])

    return { distributors }
}