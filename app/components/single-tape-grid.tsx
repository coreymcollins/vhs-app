import Link from 'next/link';
import AddRemoveTape from './add-remove-collection';
import TapeImage from './tape-image';

export function SingleTapeGrid({tape, context, session, userTapeIds}: {tape: any, context: string, session: any, userTapeIds: any}) {

    return (
        <div className="tape-item">
            { tape.coverfront && '\\x' !== tape.coverfront && tape.coverfront.length > 0 && (
                <Link href={`/tape/${tape.tape_id}`}>
                    <TapeImage tape={tape} />
                </Link>
            )}

            <Link href={`/tape/${tape.tape_id}`}>
                <h3>{tape.title}</h3>
            </Link>

            { undefined !== session && null !== session && (
                <AddRemoveTape tapeId={tape.tape_id} userTapeIds={userTapeIds} user={session} />
            )}
        </div>
    )
}