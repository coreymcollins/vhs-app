'use server'

import { revalidatePath } from 'next/cache'
import postgres from 'postgres'
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
        genre: z.string().min(1),
        year: z.number().min(4),
    })

    const parse = schema.safeParse({
        barcode: formData.get( 'barcode' ),
        title: formData.get( 'title' ),
        description: formData.get( 'description' ),
        genre: formData.get( 'genre' ),
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

        await sql`
            INSERT INTO tapes (barcode, title, description, genre, year, coverfront)
            VALUES (${data.barcode}, ${data.title}, ${data.description}, ${data.genre}, ${data.year}, ${coverFrontData})
        `
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