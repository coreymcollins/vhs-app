'use client'

import MultiSelectField from '@/app/components/multi-select-field'
import { useQuery } from '@tanstack/react-query'
import { getAllGenres } from '@/app/queries/getAllGenres'
import { getAllDistributors } from '@/app/queries/getAllDistributors'

export default function MultiSelectFilters() {
    const {data: genres} = useQuery({
        queryKey: ['genres'],
        queryFn: getAllGenres
    })

    const {data: distributors} = useQuery({
        queryKey: ['distributors'],
        queryFn: getAllDistributors
    })

    const mappedGenres = genres ? genres.map( ( {genre_name, genre_slug} ) => ({
        value: genre_slug,
        label: genre_name
    })) : []

    const mappedDistributors = distributors ? distributors.map( ( {distributor_name, distributor_slug} ) => ({
        value: distributor_slug,
        label: distributor_name
    })) : []

    return (
        <div className="multi-select-row">
            <div className="multi-select-column">
                <label className="multi-select-label" htmlFor="genre">Filter by Genre</label>
                <MultiSelectField options={mappedGenres} term='genre' />
            </div>
            <div className="multi-select-column">
                <label className="multi-select-label" htmlFor="distributor">Filter by Distributor</label>
                <MultiSelectField options={mappedDistributors} term='distributor' />
            </div>
        </div>
    )
}