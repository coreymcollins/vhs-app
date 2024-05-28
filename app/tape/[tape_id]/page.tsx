import { checkLoginStatus } from '@/app/actions/check-login-status';
import AddRemoveTape from '@/app/components/add-remove-collection';
import TapeImage from '@/app/components/tape-image';
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link';

export async function generateMetadata( { params }: { params: { tape_id: number } } ) {
    const tapeId = params.tape_id

    const { data: tape, error: tapeError } = await supabase
        .from( 'tapes' )
        .select( 'title' )
        .eq( 'tape_id', tapeId )
        .single()

    if ( tapeError ) {
        console.error( 'Error fetching tape:', tapeError )
        
        return {
            title: 'Revival Video',
            description: 'Be kind. Revive.',
        }
    }

    return {
        title: `Revival Video: ${tape.title}`,
        description: `View the details of "${tape.title}".`,
    }
}

export default async function SingleTapePage( { params }: { params: { tape_id: number } } ) {

    const tapeId = params.tape_id

    const { data: tapeResult, error: tapeError } = await supabase
        .from( 'tapes' )
        .select( 'tape_id, title, description, year, cover_front_url, barcode' )
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
    const user = await checkLoginStatus()

    return (
        <>
            <div className="container-single-tape">
                { tape.cover_front_url && '\\x' !== tape.cover_front_url && tape.cover_front_url.length > 0 ? (
                    <div className="container-single-tape-cover">
                        <TapeImage tape={tape} layout="single" priority={true} />
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

                    { undefined !== user && null !== user && (
                        <>
                            <div className="container-single-tape-row">
                                <AddRemoveTape tapeId={tape.tape_id} userTapeIds={[tape.tape_id]} user={user} />
                            </div>

                            { 'admin' === user.user_metadata.user_role && (
                                <div className="container-single-tape-row">
                                    <Link href={`/edit/${tape.tape_id}`}>Edit Tape</Link>
                                </div>
                            )}
                        </>

                    )}
                </div>
            </div>
        </>
    )
}