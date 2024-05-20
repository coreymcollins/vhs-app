'use client'

import { useEffect, useState } from 'react';
import { MultiTapeGrid } from './multi-tape-grid';
import { getUserTapeIds } from '../actions';
import { PaginationProps } from './types';

export function SearchResultGrid( props: PaginationProps) {
    let {session} = props
    const [userTapeIds, setUserTapeIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = null !== session ? session.id : ''
                const tapeIds = await getUserTapeIds( userId );
                setUserTapeIds(tapeIds);
            } catch (error) {
                console.error('Error checking library for tape:', error);
            }
        };

        fetchData();
    }, [session]);

    const updatedProps = {
        ...props,
        context: 'search',
        userTapeIds
    }

    return (
        <>
            <MultiTapeGrid key="searchResult" {...updatedProps} />
        </>
    );
}
