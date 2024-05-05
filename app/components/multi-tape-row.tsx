import { SingleTapeRow } from './single-tape-row';

export function MultiTapeRow({tapes, context, session}: {tapes: any[], context: string, session: any}) {

    const tapesArray = Array.isArray(tapes) ? tapes : [tapes]

    if ( null === tapesArray ) {
        return;
    }

    return (
        <>
            {tapesArray.map(( tape ) => (
                <SingleTapeRow key={`listing-${tape.tape_id}`} tape={tape} context="search" session={session} />
            ))}
        </>
    )
}