'use client'

import { useEffect, useState } from 'react';
import { MultiTapeGrid } from './multi-tape-grid';
import { getUserTapeIds } from '../actions';

export function SearchResultGrid({ tapes, session, pageNumber }: { tapes: any, session: any, pageNumber: number }) {
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

    return (
        <>
            <MultiTapeGrid key="searchResult" tapes={tapes} context="search" session={session} userTapeIds={userTapeIds} pageNumber={pageNumber} />
        </>
    );
}
