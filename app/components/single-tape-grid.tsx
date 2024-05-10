import Link from 'next/link';
import AddRemoveTape from './add-remove-collection';

export function SingleTapeGrid({tape, context, session}: {tape: any, context: string, session: any}) {
    
    return (
        <div className="tape-item">
            { tape.coverfront && '\\x' !== tape.coverfront && tape.coverfront.length > 0 && (
                <Link href={`/tape/${tape.tape_id}`}>
                    <img
                        src={`data:image/jpeg;base64,${Buffer.from(tape.coverfront.substring(2), 'hex').toString('base64')}`}
                        alt={`${tape.title} front cover`}
                        className="cover-front"
                    />
                </Link>
            )}

            <Link href={`/tape/${tape.tape_id}`}>
                <h2>{tape.title}</h2>
            </Link>

            { undefined !== session && null !== session && (
                <AddRemoveTape tapeId={tape.tape_id} />
            )}
        </div>
    )
}