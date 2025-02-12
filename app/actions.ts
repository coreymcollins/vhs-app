'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server';
import { checkLoginStatus } from './actions/check-login-status';

export async function createEntry(
    prevState: {
        message: string;
    },
    formData: FormData,
    ) {
    const schema = z.object({
        barcode: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        year: z.number().min(4),
        date_added: z.string(),
        distributor: z.number().nullable().optional(),
        distributor_name: z.string().nullable(),
        add_to_library: z.string().nullable(),
    })

    const parse = schema.safeParse({
        barcode: formData.get( 'barcode' ),
        title: formData.get( 'title' ),
        description: formData.get( 'description' ),
        year: parseInt(formData.get( 'year' ) as string || '0'), // Convert to number or default to 0
        date_added: formData.get( 'date_added' ),
        distributor: formData.get('distributor') && !isNaN(parseInt(formData.get('distributor') as string)) ? parseInt( formData.get( 'distributor' ) as string ) : null,
        distributor_name: formData.get('distributor_name') || null,
        add_to_library: formData.get( 'add_to_library' ),
    })

    if ( ! parse.success ) {
        console.error( 'Form data parsing failed when adding new entry:', parse.error )
        return { message: `Failed to add entry: ${parse.error.message}` }
    }

    const genresSchema = z.object({
        genres: z.array(z.string().min(1)),
    })

    const genres = genresSchema.safeParse({
        genres: formData.getAll( 'genres' )
    })

    const data = parse.data
    const coverFrontFile = formData.get( 'coverfront' ) as File | null

    await addNewTapeSupabase( data, genres, coverFrontFile )
}

export async function updateEntry(
    prevState: {
        message: string;
    },
    formData: FormData,
    ) {
    const supabase = createClient()

    const schema = z.object({
        tape_id: z.number(),
        barcode: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        genres: z.array(z.string().min(1)),
        year: z.number().min(4),
        distributor: z.number().nullable().optional(),
        distributor_name: z.string().nullable(),
        date_updated: z.string(),
    });

    const parse = schema.safeParse({
        tape_id: parseInt(formData.get('tape_id') as string),
        barcode: formData.get('barcode'),
        title: formData.get('title'),
        description: formData.get('description'),
        genres: formData.getAll('genres'),
        year: parseInt(formData.get('year') as string || '0'), // Convert to number or default to 0
        distributor: formData.get('distributor') && !isNaN(parseInt(formData.get('distributor') as string)) ? parseInt( formData.get( 'distributor' ) as string ) : null,
        distributor_name: formData.get('distributor_name') || null,
        date_updated: formData.get('date_updated'),
    });

    if ( ! parse.success ) {
        console.error( 'Form data parsing failed when editing:', parse.error );
        return { message: `Failed to update entry: ${parse.error.message}` };
    }

    const formUpdates: any = parse.data;
    formUpdates.distributor = formUpdates.distributor === '' ? null : formUpdates.distributor;
    const newCoverImage = formData.get( 'coverfront' ) as File | null
    
    if ( null !== newCoverImage && newCoverImage.size > 0 ) {
        uploadImageToStorage( formUpdates.tape_id, newCoverImage )
    }

    const { data, error } = await supabase
        .rpc('update_tape', {
            data: formUpdates
        })

    if ( error ) {
        console.error( 'Error in updating an existing tape:', error )
        return null;
    } else {
        return data;
    }
}

export async function searchByBarcode(barcode: string) {
    const supabase = createClient()

    const { data: tape, error } = await supabase.rpc( 'get_tape_by_barcode', { barcodequery: barcode });

    if (error) {
        console.error(`Error searching for tape by barcode: ${barcode}`)
        throw error
    } else {
        return tape;
    }
}

export async function searchByQuery(queryString: string) {
    const supabase = createClient()

    const { data: tapes, error } = await supabase.rpc( 'get_tape_by_search_query', { querystring: queryString });

    if (error) {
        console.error(`Error searching for tape by barcode: ${queryString}`)
        throw error
    } else {
        return tapes;
    }
}

export async function searchGenres() {
    const supabase = createClient()

    let { data: genres, error } = await supabase
        .from( 'genres' )
        .select( 'genre_name' )
        .order( 'genre_name' )

    if ( error ) {
        console.error( 'error in adding a new tape:', error )
        return null;
    }

    return genres;
}

export async function searchDistributors() {
    const supabase = createClient()

    let { data: distributors, error } = await supabase
        .from( 'distributors' )
        .select( `*` )
        .order( 'distributor_name_lower' )

    if ( error ) {
        console.error( 'error in adding a new tape:', error )
        return null;
    }

    return distributors;
}

export async function getUserTapeIds( userId: string ) {

    if ( ! userId ) {
        return [];
    }

    const supabase = createClient()

    const { data, error } = await supabase
        .from( 'users_tapes' )
        .select( 'tape_id' )
        .eq( 'uuid', userId )
        .order( 'tape_id' )

    if (error) {
        console.error(`Error getting tapes for user`)
        throw error
    } else {
        const tapeIds = data.map(item => item.tape_id);
        return tapeIds;
    }
}

export async function addToLibrary( tapeId: number, userId: string ) {
    const supabase = createClient()

    await supabase.rpc( 'insert_user_tape', { user_id_query: userId, tape_id_query: tapeId });
}

export async function removeFromLibrary( tapeId: number, userId: string ) {
    const supabase = createClient()

    await supabase.rpc( 'delete_user_tape', { user_id_query: userId, tape_id_query: tapeId });
}

export async function addNewTapeSupabase( data: any, genres: any, coverfront: File | null ) {
    const newTapeData = await addNewTape( data )
    const tapeId = null !== newTapeData && undefined !== newTapeData ? newTapeData[0].tape_id : ''

    if ( ! newTapeData || ! tapeId ) {
        return;
    }

    const distributorId = data.distributor

    await addNewTapeGenres( genres, tapeId )
    await addNewTapeDistributor( distributorId, tapeId )

    if ( null !== coverfront && coverfront.size > 0 ) {
        await uploadImageToStorage( tapeId, coverfront )
    }

    const user = await checkLoginStatus()

    if ( ! user ) {
        return;
    }

    const userUuid = user.id

    if ( 'true' === data.add_to_library ) {
        await addToLibrary( tapeId, userUuid )
    }
}

export async function addNewTape( tapeData: any ) {
    const supabase = createClient()
    const user = await checkLoginStatus()

    if ( ! user ) {
        return;
    }

    const userUuid = user.id

    if ( ! userUuid ) {
        return;
    }
    
    tapeData['uuid'] = userUuid
    
    const { data, error } = await supabase
        .rpc('insert_new_tape', {
            data: tapeData
        })

    if ( error ) {
        console.error( 'error in adding a new tape:', error )
        return null;
    }

    return data;
}

export async function addNewTapeGenres( genres: any, tapeId: number ) {
    const supabase = createClient()
    const user = await checkLoginStatus()

    if ( ! user ) {
        return;
    }

    const userUuid = user.id

    if ( ! userUuid ) {
        return;
    }

    if ( genres.data && genres.data.genres ) {
        const genreNames = genres.data.genres

        for ( const genre of genreNames ) {
    
            const { data: genreData, error } = await supabase
                .from( 'genres' )
                .select( 'genre_id' )
                .eq( 'genre_name', genre )
    
            if ( error ) {
                console.error( error )
                return null
            }
    
            if ( genreData && genreData.length > 0 ) {
                const genreId = genreData[0].genre_id
    
                const { data, error } = await supabase
                    .rpc( 'insert_tape_genre', {
                        tape_id: tapeId,
                        genre_id: genreId,
                        uuid: userUuid
                    })
    
                if ( error ) {
                    console.error( error )
                    return null
                }
            }
        }
    }    
}

export async function addNewTapeDistributor( distributorId: string, tapeId: number ) {
    const supabase = createClient()
    const user = await checkLoginStatus()

    if ( ! user ) {
        return;
    }

    const userUuid = user.id

    if ( ! userUuid ) {
        return;
    }

    if ( ! distributorId ) {
        return;
    }

    const { data, error } = await supabase
        .rpc( 'insert_tape_distributor', {
            tape_id: tapeId,
            distributor_id: distributorId,
            uuid: userUuid
        })

    if ( error ) {
        console.error( error )
        return null
    }
}

export async function uploadImageToStorage(tapeId: number, image: File | null) {

    if ( null === image || null !== image && image.size <= 0 ) {
        return
    }

    const supabase = await createClient()
    const imageFileName = `cover_tape_id_${tapeId}_${Date.now()}`

    try {
        const {data: imageUpload, error} = await supabase.storage
            .from( 'covers' )
            .upload( imageFileName, image )

        if ( error ) {
            throw error
        }

    } catch ( error ) {
        console.error( 'Error uploading image to storage:', error )
    }

    // Add the URL to the tapes table.
    const {data: imageUrl} = await supabase.storage
        .from( 'covers' )
        .getPublicUrl( imageFileName )

    try {
        const {error: imageUrlError } = await supabase.from( 'tapes' )
            .update({cover_front_url: imageUrl.publicUrl})
            .eq( 'tape_id', tapeId )

        if ( imageUrlError ) {
            throw imageUrlError
        }
    } catch ( imageUrlError ) {
        console.error( 'Error adding image to tapes table:', imageUrlError )
    }
}

export async function getUsernameByUuid( uuid: string ) {

    if ( ! uuid ) {
        return;
    }

    const supabase = createClient()

    const { data: user, error } = await supabase
        .from( 'users' )
        .select( 'username' )
        .eq( 'uuid', uuid )
        .maybeSingle()
    
    if ( error ) {
        console.error( 'Error fetching user:', error.message );

        return null;
    }

    if ( null === user ) {
        return null
    }

    if ( null === user.username ) {
        return null
    }

    return user.username
}

export const getSiteUrl = (): string => {
    return process.env.NEXT_PUBLIC_SITE_URL || '';
};

export async function checkForUserByUsername( username: any ) {

    if ( ! username ) {
        return null
    }

    const supabase = createClient()

    const { data: user, error } = await supabase
        .from( 'users' )
        .select( 'username' )
        .eq( 'username', username )
        .maybeSingle()
    
    if ( error ) {
        console.error( 'Error fetching user:', error.message );
        return null;
    }

    if ( null === user ) {
        return null
    }

    if ( null === user.username ) {
        return null
    }

    return true
}

export async function getUsersTapesByUuid( uuid: string ) {
    
    if ( ! uuid ) {
        return []
    }
    
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_tapes_by_user_id', { useridquery: uuid });
    
    if ( error ) {
        console.error( 'Error fetching tapes in collection:', error.message );
        return null;
    }

    return data;
}

export async function getUserCollection( username: string ) {

    if ( null === username ) {
        return { error: 'Username cannot be null' }
    }

    const supabase = createClient()

    const { data: user, error: userError } = await supabase
        .from( 'users' )
        .select( 'uuid' )
        .eq( 'username', username )
        .maybeSingle()
    
    if ( userError ) {
        console.error( 'Error fetching user:', userError.message );
        return { error: `Error fetching user: ${userError.message}`} 
    }

    if ( null === user ) {
        console.error( 'Username does not exist.' );
        return { error: 'Username does not exist'} 
    }

    const { data: tapes, error: tapesError } = await supabase.rpc('get_tapes_by_user_id', { useridquery: user.uuid });

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return {tapes};
}

export async function getTapesByGenre( genreName: string ) {

    if ( null === genreName ) {
        return { error: 'genre cannot be null' }
    }

    const supabase = createClient()

    const { data: genre, error: genreError } = await supabase
        .from('genres')
        .select('genre_id')
        .eq('genre_slug', genreName )
        .single();

    if ( genreError || ! genre ) {
        return []
    }

    const { data: tapes, error: tapesError } = await supabase
        .from('tapes')
        .select(`
            *,
            tapes_genres:tapes_genres!inner (
                genre_id
            )
        `)
        .eq('tapes_genres.genre_id', genre.genre_id)
        .order( 'title' );

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return tapes;
}

export async function getGenreNameBySlug( genreSlug: string ) {

    if ( null === genreSlug ) {
        return { error: 'genre cannot be null' }
    }

    const supabase = createClient()

    const { data: genre, error: genreError } = await supabase
        .from('genres')
        .select('genre_name')
        .eq('genre_slug', genreSlug )
        .single();

    if ( null === genre ) {
        return { error: 'genre ID cannot be null' }
    }

    return genre.genre_name
}

export async function getGenreSlugByName( genreName: string ) {

    if ( null === genreName ) {
        return { error: 'genre cannot be null' }
    }

    const supabase = createClient()

    const { data: genre, error: genreError } = await supabase
        .from('genres')
        .select('genre_slug')
        .eq('genre_slug', genreName )
        .single();

    if ( null === genre ) {
        return { error: 'genre ID cannot be null' }
    }

    return genre.genre_slug
}

export async function getTapesByYear( year: number ) {

    if ( null === year ) {
        return { error: 'year cannot be null' }
    }

    const supabase = createClient()

    const { data: tapes, error: tapesError } = await supabase
        .from('tapes')
        .select(`*`)
        .eq('year', year)
        .order( 'title' );

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return tapes;
}

export async function getDistributorNameBySlug( distributorSlug: string ) {
    
    if ( null === distributorSlug ) {
        return { error: 'distributor cannot be null' }
    }
    
    const supabase = createClient()
    
    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_name')
        .eq('distributor_slug', distributorSlug )
        .single();
    
    if ( null === distributor ) {
        return { error: 'distributor ID cannot be null' }
    }
    
    return distributor.distributor_name
}

export async function getDistributorNameById( distributorId: number ) {
    
    if ( null === distributorId ) {
        return { error: 'distributor id cannot be null' }
    }
    
    const supabase = createClient()
    
    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_name')
        .eq('distributor_id', distributorId )
        .single();
    
    if ( null === distributor ) {
        return { error: 'distributor id cannot be null' }
    }
    
    return distributor.distributor_name
}

export async function getDistributorSlugByName( distributorName: string ) {

    if ( null === distributorName ) {
        return { error: 'distributor cannot be null' }
    }

    const supabase = createClient()

    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_slug')
        .eq('distributor_slug', distributorName )
        .single();

    if ( null === distributor ) {
        return { error: 'distributor ID cannot be null' }
    }

    return distributor.distributor_slug
}

export async function getTapesByDistributor( distributorSlug: string ) {

    if ( null === distributorSlug ) {
        return { error: 'distributor cannot be null' }
    }

    const supabase = createClient()

    const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .select('distributor_id')
        .eq('distributor_slug', distributorSlug )
        .single();

    if ( distributorError || ! distributor ) {
        return []
    }

    const { data: tapes, error: tapesError } = await supabase
        .from('tapes')
        .select(`
            *,
            tapes_distributors:tapes_distributors!inner (
                distributor_id
            )
        `)
        .eq('tapes_distributors.distributor_id', distributor.distributor_id)
        .order( 'title' );

    if ( tapesError ) {
        console.error('Error fetching tapes in collection:', tapesError.message);
        return { error: `Error fetching tapes in collection: ${tapesError.message}`} 
    }

    return tapes;
}

export async function getTapesByQueryArgs( results: any, searchParams: any ) {

    if ( undefined === searchParams ) {
        return results
    }

    if ( undefined !== searchParams.distributor && undefined === searchParams.genre ) {
        let distributorTapes = await getTapesByDistributor( searchParams.distributor )

        if ( Array.isArray( distributorTapes ) && Array.isArray( results ) ) {
            let foundTapes = new Set( distributorTapes.map( item => item.tape_id ) )
            results = results.filter( item => foundTapes.has( item.tape_id ) )
        }
    } else if ( undefined !== searchParams.genre && undefined === searchParams.distributor ) {
        let genreTapes = await getTapesByGenre( searchParams.genre )

        if ( Array.isArray( genreTapes ) && Array.isArray( results ) ) {
            let foundTapes = new Set( genreTapes.map( item => item.tape_id ) )
            results = results.filter( item => foundTapes.has( item.tape_id ) )
        }
    } else if ( undefined !== searchParams.genre && undefined !== searchParams.distributor ) {
        let distributorTapes = await getTapesByDistributor( searchParams.distributor )
        let genreTapes = await getTapesByGenre( searchParams.genre )

        if ( Array.isArray( distributorTapes ) && Array.isArray( genreTapes ) && Array.isArray( results ) ) {
            let foundDistributorTapes = new Set( distributorTapes.map( item => item.tape_id ) )
            let foundGenreTapes = new Set( genreTapes.map( item => item.tape_id ) )
            
            results = genreTapes.filter( item => foundDistributorTapes.has( item.tape_id ) && foundGenreTapes.has( item.tape_id ) )
        }
    }

    return results
}