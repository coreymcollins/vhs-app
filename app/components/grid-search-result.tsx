import { MultiTapeGrid } from './multi-tape-grid';

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    year: number;
    coverfront: Buffer | null;
    date_added: string;
    date_updated: string;
    genres: JSON;
}

export function SearchResultGrid({tapes, session}: {tapes: any, session: any}) {

    return (
        <MultiTapeGrid key="searchResult" tapes={tapes} context="search" session={session} />
    )
}