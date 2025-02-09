import React, { useEffect, useState } from 'react'
import CreateableSelect from 'react-select/creatable'
import FetchDistributors from './fetch-distributors';

interface DistributorOption {
    value: number | null;
    label: string;
}

interface SearchableSelectProps {
    initialValue?: { distributor_id: number | null; distributor_name: string } | null;
    onChange?: ( selected: {distributor_id: number | null; distributor_name: string } | null ) => void;
}

export default function SearchableSelect( { initialValue, onChange }: SearchableSelectProps ) {
    const { distributors } = FetchDistributors();
    const options = distributors.map(({ distributor_id, distributor_name }) => ({
        value: distributor_id,
        label: distributor_name
    }));

    const [selectedOption, setSelectedOption] = useState<DistributorOption | null>(null);

    const handleChange = ( option: DistributorOption | null ) => {
        setSelectedOption( option );

        if ( onChange ) {
            onChange( option ? {distributor_id: option.value, distributor_name: option.label} : null);
        }
    }

    useEffect(() => {
        if ( initialValue?.distributor_id ) {
            setSelectedOption({
                value: initialValue.distributor_id,
                label: initialValue.distributor_name || 'Loading...',
            });
        } else {
            setSelectedOption( null )
        }
    }, [initialValue, distributors]);

    return (
        <CreateableSelect
            options={options}
            value={selectedOption}
            onChange={handleChange}
            placeholder="Search for a distributor..."
            name="distributor"
            isSearchable
            isClearable
            className="input-searchable"
        />
    );
}