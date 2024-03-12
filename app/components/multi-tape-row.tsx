import { SingleTapeRow } from './single-tape-row';

export function MultiTapeRow({tapes, context}: {tapes: any[], context: string}) {

    const tapesArray = Array.isArray(tapes) ? tapes : [tapes]

    return (
        <>
            {tapesArray.map(( tape ) => (
                <SingleTapeRow key={`listing-${tape.tape_id}`} tape={tape} context="search" />
            ))}
        </>
    )
}