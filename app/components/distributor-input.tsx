import React, { useEffect, useState } from 'react'
import CreateableSelect from 'react-select/creatable'
import FetchDistributors from './fetch-distributors';

interface DistributorOption {
    value: number;
    label: string;
}

interface SearchableSelectProps {
    initialValue?: { distributor_id: number; distributor_name: string } | null;
}

export default function SearchableSelect( { initialValue }: SearchableSelectProps ) {
    const { distributors } = FetchDistributors();
    const options = distributors.map(({ distributor_id, distributor_name }) => ({
        value: distributor_id,
        label: distributor_name
    }));

    const [selectedOption, setSelectedOption] = useState<DistributorOption | null>(null);

    useEffect(() => {
        if (initialValue && distributors.length > 0) {
            setSelectedOption({
                value: initialValue.distributor_id,
                label: initialValue.distributor_name
            });
        }
    }, [initialValue, distributors]);

    return (
        <CreateableSelect
            options={options}
            value={selectedOption}
            onChange={( option ) => setSelectedOption( option )}
            placeholder="Search for a distributor..."
            name="distributor"
            isSearchable
            isClearable
            className="input-searchable"
        />
    );
}