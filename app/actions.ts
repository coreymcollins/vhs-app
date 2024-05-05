'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import sql from './components/database'
import { supabase } from './lib/supabase';
import { createClient } from '../utils/supabase/server';
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

    const data = parse.data;
    const coverFrontFile = formData.get('coverfront') as File | null;
    const existingCoverFrontBase64 = formData.get('existing_coverfront') as string | null;

    let coverFrontData: Buffer | null = null; // Explicitly define type

    try {
        // Check if cover image is being updated
        if (coverFrontFile && coverFrontFile.size > 0) {
            const coverFrontBuffer = await coverFrontFile.arrayBuffer();
            coverFrontData = Buffer.from(coverFrontBuffer);
        } else if (existingCoverFrontBase64) {
            coverFrontData = Buffer.from(existingCoverFrontBase64, 'base64');
        }

        await sql.begin(async (sql) => {
            await sql`
                UPDATE tapes
                SET barcode = ${data.barcode},
                    title = ${data.title},
                    description = ${data.description},
                    year = ${data.year},
                    ${coverFrontData ? sql`coverfront = ${coverFrontData},` : sql``}
                    date_updated = ${data.date_updated}
                WHERE tape_id = ${data.tape_id};
            `;

            // Delete existing genre associations
            await sql`DELETE FROM tapes_genres WHERE tape_id = ${data.tape_id}`;

            // Add the genres.
            for (const genre of data.genres) {
                await sql`
                    INSERT INTO tapes_genres (tape_id, genre_id)
                    VALUES (${data.tape_id}, (SELECT genre_id FROM genres WHERE genre_name = ${genre}));
                `;
            }
        });

        revalidatePath('/');
        return { message: `Updated tape with ID ${data.tape_id}` };
    } catch (e) {
        console.error('Database update failed:', e);
        return { message: 'Failed to update entry in the database' };
    }
}

function serializeResult(result: any) {
    if (result.coverfront instanceof Uint8Array) {
        result.coverfront = Buffer.from(result.coverfront).toString('base64')
    }

    return result;
}

export async function searchByBarcode(barcode: string) {
    try {
        const result = await sql`
        SELECT tapes.tape_id,
            tapes.barcode,
            tapes.title,
            tapes.description,
            tapes.year,
            tapes.coverfront,
            STRING_AGG(genres.genre_name, ', ') AS genre_names
        FROM tapes
        LEFT JOIN tapes_genres ON tapes.tape_id = tapes_genres.tape_id
        LEFT JOIN genres ON tapes_genres.genre_id = genres.genre_id
        WHERE barcode = ${barcode}
        GROUP BY tapes.tape_id, tapes.barcode, tapes.title, tapes.description, tapes.year, tapes.coverfront
        ORDER BY tapes.tape_id;
        `;
        
        return result.length > 0 ? serializeResult(result[0]) : null;
    } catch (error) {
        console.error(`Database search failed: ${error}`)
        throw new Error('Failed to search for the item in the database')
    }
}

export async function searchByQuery(queryString: string) {
    try {
        const isNumeric = /^\d+$/.test(queryString);

        const result = await sql`
        SELECT tapes.tape_id,
            tapes.barcode,
            tapes.title,
            tapes.description,
            tapes.year,
            tapes.coverfront,
            STRING_AGG(genres.genre_name, ', ') AS genre_names
        FROM tapes
        LEFT JOIN tapes_genres ON tapes.tape_id = tapes_genres.tape_id
        LEFT JOIN genres ON tapes_genres.genre_id = genres.genre_id
        WHERE ${
            isNumeric && queryString.length < 5
                ? sql`
                    year = ${queryString}
                `
                : sql`
                    LOWER(title) LIKE ${'%'+queryString.toLowerCase()+'%'}
                    OR LOWER(description) LIKE ${'%'+queryString.toLowerCase()+'%'}
                    OR LOWER(genres.genre_name) LIKE ${'%'+queryString.toLowerCase()+'%'}
                    OR CAST(barcode AS TEXT) LIKE ${'%'+queryString+'%'}
                `
        }
        GROUP BY tapes.tape_id, tapes.barcode, tapes.title, tapes.description, tapes.year, tapes.coverfront
        ORDER BY tapes.tape_id;
        `;

        return result.length > 0 ? result.map(row => serializeResult(row)) : null;
    } catch (error) {
        console.error(`Database search failed: ${error}`);
        throw new Error('Failed to search for the item in the database');
    }
}

export async function searchGenres() {
    try {
        const result = await sql`
            SELECT genre_name FROM genres
            ORDER BY genre_name;
        `;
        
        const genres = result.map(( row: any ) => row.genre_name )
        return genres
    } catch ( error ) {
        console.error( `Failed to fetch genres: ${error}`)
        throw new Error( 'Failed to fetch genres from the database' )
    }
}

export async function checkLibraryForTape(tapeId: number): Promise<boolean> {
    const userId = await getCurrentUserSupabaseId()

    const { data, error } = await supabase.rpc( 'check_user_tape', { user_id_query: userId, tape_id_query: tapeId });

    if (error) {
        console.error(`Error searching for tape by ID: ${tapeId}`)
        throw error
    } else {
        return data;
    }
}

export async function addToLibrary( tapeId: number ) {
    const client = createClient()
    const userId = await getCurrentUserSupabaseId()

    await client.rpc( 'insert_user_tape', { user_id_query: userId, tape_id_query: tapeId });
}

export async function removeFromLibrary( tapeId: number ) {
    const client = createClient()
    const userId = await getCurrentUserSupabaseId()

    await client.rpc( 'delete_user_tape', { user_id_query: userId, tape_id_query: tapeId });
}

export async function getCurrentUserSupabaseId() {
    const client = createClient()
    const { data, error } = await client.auth.getUser()
    let userId: string
    userId = null !== data && null !== data.user ? data.user.id : ''

    if (error) {
        console.error(`Error searching for user`)
        throw error
    } else {
        return userId
    }
}

export async function getCurrentUserSupabaseAuth() {
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()

    if ( null !== user ) {
        return user
    } else {
        return null
    }
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
    const getLoggedInUser = await checkLoginStatus()
    const userUuid: string = null !== getLoggedInUser ? getLoggedInUser.id : ''
    const client = createClient()

    if ( ! userUuid ) {
        return;
    }
    
    tapeData['uuid'] = userUuid
    tapeData['coverFrontData'] = coverfront
    
    const { data, error } = await client
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
    const getLoggedInUser = await checkLoginStatus()
    const userUuid: string = null !== getLoggedInUser ? getLoggedInUser.id : ''
    const client = createClient()

    if ( ! userUuid ) {
        return;
    }

    if ( genres.data && genres.data.genres ) {
        const genreNames = genres.data.genres

        for ( const genre of genreNames ) {
    
            const { data: genreData, error } = await client
                .from( 'genres' )
                .select( 'genre_id' )
                .eq( 'genre_name', genre )
    
            if ( error ) {
                console.error( error )
                return null
            }
    
            if ( genreData && genreData.length > 0 ) {
                const genreId = genreData[0].genre_id
    
                const { data, error } = await client
                    .rpc( 'insert_tape_genre2', {
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
