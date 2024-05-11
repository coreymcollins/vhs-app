import { SingleTapeGrid } from './single-tape-grid';

export function MultiTapeGrid({tapes, context, session, userTapeIds}: {tapes: any[], context: string, session: any, userTapeIds: any}) {

    const tapesArray = Array.isArray(tapes) ? tapes : [tapes]

    if ( null === tapesArray ) {
        return;
    }

    return (
        <>
            <div className="tape-results grid">
                {tapesArray.map(( tape ) => (
                    <SingleTapeGrid key={`listing-${tape.tape_id}`} tape={tape} context="search" session={session} userTapeIds={userTapeIds} />
                ))}
            </div>
        </>
    )
}