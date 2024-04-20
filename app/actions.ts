'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import sql from './components/database'
import { options } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

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
        genres: z.array(z.string().min(1)),
        year: z.number().min(4),
    })

    const parse = schema.safeParse({
        barcode: formData.get( 'barcode' ),
        title: formData.get( 'title' ),
        description: formData.get( 'description' ),
        genres: formData.getAll( 'genres' ),
        year: parseInt(formData.get('year') as string || '0'), // Convert to number or default to 0
    })

    if ( ! parse.success ) {
        console.error('Form data parsing failed:', parse.error)
        return { message: `Failed to add entry: ${parse.error.message}` }
    }

    const data = parse.data
    const coverFrontFile = formData.get('coverfront') as File | null

    if (!coverFrontFile) {
        console.error( 'Cover front file is missing' )
        return{ message: 'Cover front file is missing' }
    }

    try {
        const coverFrontBuffer = await coverFrontFile.arrayBuffer()
        const coverFrontData = Buffer.from(coverFrontBuffer)

        await sql.begin(async( sql ) => {
            const result = await sql`
                INSERT INTO tapes (barcode, title, description, year, coverfront)
                VALUES (${data.barcode}, ${data.title}, ${data.description}, ${data.year}, ${coverFrontData})
                RETURNING tape_id;
            `;

            const tape_id = result[0].tape_id;

            // Add the genres.
            for ( const genre of data.genres ) {
                await sql`
                    INSERT INTO tapes_genres (tape_id, genre_id)
                    VALUES (${tape_id}, (SELECT genre_id FROM genres WHERE genre_name = ${genre}));
                `
            }

        })

        revalidatePath( '/' )
        return { message: `Added title ${data.title}` }
    } catch (e) {
        console.error('Database insertion failed:', e)
        return { message: 'Failed to add entry to the database' }
    }
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
    });

    const parse = schema.safeParse({
        tape_id: parseInt(formData.get('tape_id') as string),
        barcode: formData.get('barcode'),
        title: formData.get('title'),
        description: formData.get('description'),
        genres: formData.getAll('genres'),
        year: parseInt(formData.get('year') as string || '0'), // Convert to number or default to 0
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
                    ${coverFrontData ? sql`coverfront = ${coverFrontData}` : sql``}
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

export async function redirectIfNotLoggedIn( router: any ) {
    console.log( router.asPath )
    // const session = await getServerSession( options )

    // if ( ! session ) {
    //     redirect( '/api/auth/signin?callbackUrl=/add-tape' )
    // }
}