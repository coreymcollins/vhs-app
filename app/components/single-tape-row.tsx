import Link from 'next/link';

export function SingleTapeRow({tape, context}: {tape: any, context: string}) {
    const genres = tape.genre_names ? tape.genre_names.split(', ').sort() : [];

    return (
        <tr key={`${context}-${tape.barcode}-table-row-search`}>
            <td key={`${tape.barcode}-${tape.tape_id}`} data-label="ID">
                {tape.tape_id}
            </td>
            <td key={`${context}-${tape.barcode}`} data-label="Barcode">
                {tape.barcode}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.title}`} data-label="Title">
                {tape.title}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.description}`} data-label="Description">
                {tape.description}
            </td>
            <td key={`${context}-${tape.barcode}-genres`} data-label="Genres">
                {genres.join(', ')}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.year}`} data-label="Year">
                {tape.year}
            </td>
            <td key={`${context}-${tape.barcode}-coverfront`} data-label="Cover">
                { tape.coverfront && tape.coverfront.length > 0 ? (
                    <img src={`data:image/jpeg;base64,${tape.coverfront.toString('base64')}`} alt={`${tape.title} front cover`} className="cover-front" />
                ) : (
                    <>No image available</>
                )}
            </td>
            <td>
                –
                {/* <Link href={`/edit/${tape.tape_id}`}>
                    Edit Tape
                </Link> */}
            </td>
        </tr>
    )
}