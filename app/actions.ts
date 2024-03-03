'use server'

import { revalidatePath } from 'next/cache'
import postgres from 'postgres'
import { z } from 'zod'

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
    ssl: 'allow'
})

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
        // return { message: `Failed to add title with the following data: ${parse}` }
    }

    const data = parse.data

    try {
        await sql`
            INSERT INTO tapes (barcode, title, description, genre, year)
            VALUES (${data.barcode}, ${data.title}, ${data.description}, ${data.genre}, ${data.year})
        `
        revalidatePath( '/' )

        return { message: `Added title ${data.title}` }
    } catch (e) {
        console.error('Database insertion failed:', e)
        return { message: 'Failed to add entry to the database' }
        // return { message: `Failed to add title with the following data: ${data.barcode}, ${data.title}, ${data.description}, ${data.genre}, ${data.year}` }
    }
}