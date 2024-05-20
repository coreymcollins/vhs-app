import Link from 'next/link';
import AddRemoveTape from './add-remove-collection';
import TapeImage from './tape-image';
import { MultiTapeGridProps } from './multi-tape-grid';

interface SingleTapeGridProps extends MultiTapeGridProps {
    tape: any;
}

export function SingleTapeGrid(props: SingleTapeGridProps) {
    let {tape, userTapeIds, session} = props

    return (
        <div className="tape-item">
            { tape.cover_front_url && (
                <Link href={`/tape/${tape.tape_id}`}>
                    <div className="cover-grid-container">
                        <TapeImage tape={tape} layout="archive" />
                    </div>
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