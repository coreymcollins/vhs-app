'use client'

import { useEffect, useState } from 'react';
import { MultiTapeGrid } from './multi-tape-grid';
import { getUserTapeIds } from '../actions';

export function SearchResultGrid({ tapes, session }: { tapes: any, session: any }) {
    const [userTapeIds, setUserTapeIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tapeIds = await getUserTapeIds();
                setUserTapeIds(tapeIds);
            } catch (error) {
                console.error('Error checking library for tape:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <MultiTapeGrid key="searchResult" tapes={tapes} context="search" session={session} userTapeIds={userTapeIds}/>
    );
}
