'use client'

import { useEffect, useState } from 'react';
import { MultiTapeRow } from './multi-tape-row';
import { getUserTapeIds } from '../actions';

export function SearchResultTable({tapes, session}: {tapes: any, session: any}) {
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
            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Barcode</td>
                        <td>Title</td>
                        <td className="table-description">Description</td>
                        <td>Genre</td>
                        <td>Year</td>
                        <td>Cover</td>
                        { undefined !== session && null !== session ? (
                            <td className="table-library">Manage</td>
                        ) : (
                            null
                        )}
                    </tr>
                </thead>
                <tbody>
                    <MultiTapeRow key="searchResult" tapes={tapes} context="search" session={session} userTapeIds={userTapeIds} />
                </tbody>
            </table>
        </>
    )
}