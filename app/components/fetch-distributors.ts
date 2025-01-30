'use client'

import { useEffect, useState } from 'react'
import { searchDistributors } from '../actions'

interface Distributor {
    distributor_id: number;
    distributor_name: string;
}

export default function FetchDistributors() {
    const [distributors, setDistributors ] = useState<Distributor[]>([]);
    
    useEffect(() => {
        async function fetchDistributors() {
            try {
                const distributorsData = await searchDistributors()

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