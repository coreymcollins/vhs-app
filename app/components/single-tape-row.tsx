import Link from 'next/link';
import AddRemoveTape from './add-remove-collection';
import TapeImage from './tape-image';

export function SingleTapeRow({tape, context, session, userTapeIds}: {tape: any, context: string, session: any, userTapeIds: any}) {
    
    return (
        <tr key={`${context}-${tape.barcode}-table-row-search`}>
            <td key={`${tape.barcode}-${tape.tape_id}`} data-label="ID">
                {tape.tape_id}
            </td>
            <td key={`${context}-${tape.barcode}`} data-label="Barcode">
                {tape.barcode}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.title}`} data-label="Title">
                <Link href={`/tape/${tape.tape_id}`}>
                    {tape.title}
                </Link>
            </td>
            <td key={`${context}-${tape.barcode}-${tape.description}`} className="table-description" data-label="Description">
                {tape.description}
            </td>
            <td key={`${context}-${tape.barcode}-genres`} data-label="Genres">
                {tape.genres.join(', ')}
            </td>
            <td key={`${context}-${tape.barcode}-${tape.year}`} data-label="Year">
                {tape.year}
            </td>
            <td key={`${context}-${tape.barcode}-coverfront`} data-label="Cover">
                { tape.cover_front_url ? (
                    <TapeImage tape={tape} layout="archive" priority={true} />
                ) : (
                    <>No image available</>
                )}
            </td>
            { undefined !== session && null !== session ? (
                <td className="table-library" data-label="Manage Collection">
                    <AddRemoveTape tapeId={tape.tape_id} userTapeIds={userTapeIds} user={session} />
                </td>
            ) : (
                null
            )}
        </tr>
    )
}