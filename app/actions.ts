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
        title: z.string().min(1),
    })

    const parse = schema.safeParse({
        title: formData.get( 'title' )
    })

    if ( !parse.success ) {
        return{ message: 'Failed to add title' }
    }

    const data = parse.data

    try {
        await sql`
            INSERT INTO tapes (title)
            VALUES (${data.title})
        `
        revalidatePath( '/' )

        return { message: `Added title ${data.title}` }
    } catch (e) {
        return { message: 'Failed to add title' }
    }
}