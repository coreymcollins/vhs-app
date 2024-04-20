import { MultiTapeRow } from './multi-tape-row';

export function SearchResultTable({tapes}: {tapes: any[]}) {

    return (
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
                    <td>Manage</td>
                </tr>
            </thead>
            <tbody>
                <MultiTapeRow key="searchResult"  tapes={tapes} context="search" />
            </tbody>
        </table>
    )
}