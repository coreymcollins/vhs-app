'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import sql from './components/database'

export async function createEntry(
    prevState: {
        message: string;
    },
    formData: FormData,
    ) {
    const schema = z.object({
        barcode: z.string().min(1),
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

function serializeResult(result: any) {
    if (result.coverfront instanceof Uint8Array) {
        result.coverfront = Buffer.from(result.coverfront).toString('base64')
    }

    return result;
}

export async function searchByBarcode(barcode: string) {
    try {
        const result = await sql`
            SELECT * FROM tapes WHERE barcode = ${barcode}
        `
        
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