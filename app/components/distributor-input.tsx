import React, { useState } from 'react'
import CreateableSelect from 'react-select/creatable'
import FetchDistributors from './fetch-distributors';

export default function SearchableSelect() {
    const { distributors } = FetchDistributors();
    const options = distributors.map(({ distributor_id, distributor_name }) => ({
        value: distributor_id,
        label: distributor_name
    }));

    const [selectedOption, setSelectedOption] = useState<{ value: number; label: string } | null>(null);

    return (
        <CreateableSelect
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Search for a distributor..."
            name="distributor"
            isSearchable
            isClearable
            className="input-searchable"
        />
    );
}