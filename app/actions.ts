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
    })

    const parse = schema.safeParse({
        barcode: formData.get( 'barcode' ),
        title: formData.get( 'title' ),
        description: formData.get( 'description' ),
        year: parseInt(formData.get('year') as string || '0'), // Convert to number or default to 0
        date_added: formData.get( 'date_added' ),
    })

    if ( ! parse.success ) {
        console.error('Form data parsing failed:', parse.error)
        return { message: `Failed to add entry: ${parse.error.message}` }
    }

    const genresSchema = z.object({
        genres: z.array(z.string().min(1)),
    })

    const genres = genresSchema.safeParse({
        genres: formData.getAll( 'genres' )
    })

    const data = parse.data
    const coverFrontFile = formData.get('coverfront') as File | null
    let coverFrontData = '';

    if ( coverFrontFile ) {
        const coverFrontBuffer = await coverFrontFile.arrayBuffer()
        coverFrontData = Buffer.from(coverFrontBuffer).toString( 'base64' )
    }

    await addNewTapeSupabase( data, genres, coverFrontData )
}

export async function updateEntry(
    prevState: {
        message: string;
    },
    formData: FormData,
    ) {
    const supabase = createClient()
    const userId = await getCurrentUserSupabaseId()

    const schema = z.object({
        tape_id: z.number(),
        barcode: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        genres: z.array(z.string().min(1)),
        year: z.number().min(4),
        date_updated: z.string(),
    });

    const parse = schema.safeParse({
        tape_id: parseInt(formData.get('tape_id') as string),
        barcode: formData.get('barcode'),
        title: formData.get('title'),
        description: formData.get('description'),
        genres: formData.getAll('genres'),
        year: parseInt(formData.get('year') as string || '0'), // Convert to number or default to 0
        date_updated: formData.get('date_updated'),
    });

    if (!parse.success) {
        console.error('Form data parsing failed:', parse.error);
        return { message: `Failed to update entry: ${parse.error.message}` };
    }

    const formUpdates: any = parse.data;
    const coverFrontFile = formData.get('coverfront') as File | null
    let coverFrontData = '';

    if ( coverFrontFile ) {
        const coverFrontBuffer = await coverFrontFile.arrayBuffer()
        coverFrontData = Buffer.from(coverFrontBuffer).toString( 'base64' )
    }

    const existingCoverFrontBase64 = formData.get('existing_coverfront') as string | null;

    formUpdates['coverFrontData'] = '' !== coverFrontData ? coverFrontData : existingCoverFrontBase64

    const { data, error } = await supabase
        .rpc('update_tape2', {
            data: formUpdates
        })

    console.log( 'tape data on update', data )

    if ( error ) {
        console.error( 'error in updating an existing tape:', error )
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

export async function getUserTapeIds() {
    const supabase = createClient()
    const userId = await getCurrentUserSupabaseId()

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

export async function getCurrentUserSupabaseId() {
    const getLoggedInUser = await checkLoginStatus()
    const userUuid: string = null !== getLoggedInUser ? getLoggedInUser.id : ''

    if ( ! userUuid ) {
        return;
    }

    return userUuid;
}

export async function addNewTapeSupabase( data: any, genres: any, coverfront: string ) {
    const newTapeData = await addNewTape( data, coverfront )
    const tapeId = null !== newTapeData && undefined !== newTapeData ? newTapeData[0].tape_id : ''

    if ( ! newTapeData || ! tapeId ) {
        return;
    }

    await addNewTapeGenres( genres, tapeId )
}

export async function addNewTape( tapeData: any, coverfront: string ) {
    const supabase = createClient()
    const userUuid = await getCurrentUserSupabaseId()

    if ( ! userUuid ) {
        return;
    }
    
    tapeData['uuid'] = userUuid
    tapeData['coverFrontData'] = coverfront
    
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
    const userUuid = await getCurrentUserSupabaseId()

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
