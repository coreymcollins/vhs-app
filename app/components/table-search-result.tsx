import { MultiTapeRow } from './multi-tape-row';

export function SearchResultTable({tapes}: {tapes: any[]}) {

    return (
        <table>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Barcode</td>
                    <td>Title</td>
                    <td>Description</td>
                    <td>Genre</td>
                    <td>Release Year</td>
                    <td>Front Cover</td>
                    <td>Edit</td>
                </tr>
            </thead>
            <tbody>
                <MultiTapeRow key="searchResult"  tapes={tapes} context="search" />
            </tbody>
        </table>
    )
}