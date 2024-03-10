export function SingleTapeRow({tape, context}: {tape: any, context: string}) {

    return (
        <tr key={`${context}-${tape.barcode}-table-row-search`}>
            <td key={`${tape.barcode}-${tape.id}`}>
                {tape.id}
            </td>
            <td key={`${context}-${tape.barcode}`}>
                {tape.barcode}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.title}`}>
                {tape.title}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.description}`}>
                {tape.description}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.genre}`}>
                {tape.genre}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.year}`}>
                {tape.year}
            </td>
            <td key={`${context}-${tape.barcode}-coverfront`}>
                { tape.coverfront && tape.coverfront.length > 0 ? (
                    <img src={`data:image/jpeg;base64,${tape.coverfront.toString('base64')}`} alt={`${tape.title} front cover`} className="cover-front" />
                ) : (
                    <>No image available</>
                )}
            </td>
        </tr>
    )
}