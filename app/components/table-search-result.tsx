import { SingleTapeRow } from './single-tape-row';

export function SearchResultTable({tape}: {tape: any}) {

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
                </tr>
            </thead>
            <tbody>
                <SingleTapeRow key={`searchResult-${tape.id}`}  tape={tape} context="search" />
            </tbody>
        </table>
    )
}