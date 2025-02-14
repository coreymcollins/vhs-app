'use client'

import Select from 'react-select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface Option {
    value: string;
    label: string;
}

interface MultiSelectFieldProps {
    options: Option[];
    term: string;
}

export default function MultiSelectField( { options, term }: MultiSelectFieldProps ) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const handleChange = ( selectedOption: any ) => {
        
        // Build params from our selected options
        const selectedValues = selectedOption.map( ( item: Option ) => item.value )

        // Get the current query params
        const queryParams = new URLSearchParams( searchParams.toString() )

        // Update with the selected terms
        if ( selectedValues.length > 0 ) {
            queryParams.set( term, selectedValues.join( ',' ) )
        } else {
            queryParams.delete( term )
        }

        router.push( `${pathname}?${queryParams.toString()}`, {scroll: false})
    }

    return (
        <>
            <Select
                isMulti
                name={term}
                options={options}
                className="multi-select input-searchable"
                classNamePrefix="select"
                onChange={handleChange}
                value={options.filter( option =>
                    searchParams.get( term )?.split( ',' ).includes( option.value )
                )}
            />
        </>
    )
}
