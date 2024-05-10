import { MultiTapeRow } from './multi-tape-row';

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

export function SearchResultTable({tapes, session}: {tapes: any, session: any}) {

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
                    <MultiTapeRow key="searchResult" tapes={tapes} context="search" session={session} />
                </tbody>
            </table>
        </>
    )
}