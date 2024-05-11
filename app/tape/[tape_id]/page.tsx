import { getCurrentUserSupabaseAuth } from '@/app/actions';
import AddRemoveTape from '@/app/components/add-remove-collection';
import { supabase } from '@/app/lib/supabase'

export default async function SingleTapePage( { params }: { params: { tape_id: number } } ) {

    const tapeId = params.tape_id

    const { data: tapeResult, error: tapeError } = await supabase
        .from( 'tapes' )
        .select( 'tape_id, title, description, year, coverfront, barcode' )
        .eq( 'tape_id', tapeId )

    if ( tapeError ) {
        console.error( 'error fetching tape:', tapeError )
        return null;
    }

    if ( null === tapeResult ) {
        return;
    }
    
    let { data: genres, error: genresError } = await supabase
        .rpc( 'get_tape_genres', {
            tape_id_query: tapeId
    })
    
    if ( genresError ) {
        console.error( 'error fetching genres:', genresError )
        return null;
    }

    const tape = tapeResult[0];

    if ( null === tape ) {
        return;
    }
    
    const genreList: string[] = genres ? Object.values(genres) : [];
    const userAuth = await getCurrentUserSupabaseAuth()

    return (
        <>
            <div className="container-single-tape">
                { tape.coverfront && '\\x' !== tape.coverfront && tape.coverfront.length > 0 ? (
                    <div className="container-single-tape-cover">
                        <img
                            src={`data:image/jpeg;base64,${Buffer.from(tape.coverfront.substring(2), 'hex').toString('base64')}`}
                            alt={`${tape.title} front cover`}
                            className="cover-front"
                        />
                    </div>
                ) : (
                    <>
                        <em>No cover available.</em>
                    </>
                )}
                <div className="container-single-tape-content">
                    <h2>{tape.title}</h2>
                    { tape.description && (
                        <div className="container-single-tape-row">
                            <h3>Description</h3>
                            <p>{tape.description}</p>
                        </div>
                    )}

                    { genreList && (
                        <div className="container-single-tape-row">
                            <h3>Genres</h3>
                            {genreList.join(', ')}
                        </div>
                    )}

                    { tape.year && (
                        <div className="container-single-tape-row">
                            <h3>Release Year</h3>
                            <p>{tape.year}</p>
                        </div>
                    )}

                    { tape.barcode && (
                        <div className="container-single-tape-row">
                            <h3>Barcode</h3>
                            <p>{tape.barcode}</p>
                        </div>
                    )}

                    { undefined !== userAuth && null !== userAuth && (
                        <div className="container-single-tape-row">
                            <AddRemoveTape tapeId={tape.tape_id} userTapeIds={[tape.tape_id]} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}