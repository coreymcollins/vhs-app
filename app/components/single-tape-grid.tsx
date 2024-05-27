import Link from 'next/link';
import AddRemoveTape from './add-remove-collection';
import TapeImage from './tape-image';
import { MultiTapeGridProps } from './multi-tape-grid';

interface SingleTapeGridProps extends MultiTapeGridProps {
    tape: any;
    index: number;
}

export function SingleTapeGrid(props: SingleTapeGridProps) {
    let {tape, userTapeIds, session, index} = props

    const addRemoveProps = {
        tapeId: tape.tape_id,
        userTapeIds,
        user: session
    }
    
    let priority = index > 7 ? false : true

    return (
        <div className="tape-item">
            { tape.cover_front_url && (
                <Link href={`/tape/${tape.tape_id}`}>
                    <div className="cover-grid-container">
                        <TapeImage tape={tape} layout="archive" priority={priority} />
                    </div>
                </Link>
            )}

            <Link href={`/tape/${tape.tape_id}`}>
                <h3>{tape.title}</h3>
            </Link>

            { undefined !== session && null !== session && (
                <AddRemoveTape {...addRemoveProps} />
            )}
        </div>
    )
}