'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import sql from '@/app/components/database'
import bcrypt from 'bcrypt'

export async function createUser( formData: FormData ): Promise<string> {
    const schema = z.object({
        username: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
    })

    const parse = schema.safeParse({
        username: formData.get( 'username' ) as string,
        email: formData.get( 'email' ) as string,
        password: formData.get( 'password' ) as string,
    })

    if ( ! parse.success ) {
        console.error('Form data parsing failed:', parse.error)
        return 'Failed to add entry: ' + parse.error.message
    }

    const data = parse.data
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Check for an existing user with the same email address.
    const existingEmail = await getUserByEmail( data.email )
    const existingUsername = await getUserByUsername( data.username )
    
    if( existingEmail ) {
        return 'Email address already exists for a user.'
    }

    if( existingUsername ) {
        return 'Username already exists for a user.'
    }

    try {
        await sql`
            INSERT INTO users (username, email, password_hash)
            VALUES (${data.username}, ${data.email}, ${hashedPassword})
        `
        revalidatePath( '/' )

        return 'Added user ' + data.username
    } catch (e) {
        console.error('Database insertion failed:', e)
        return 'Failed to add entry to the database'
    }
}

async function getUserByEmail(email: string) {
    try {
        const result = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        return result[0]
    } catch (error) {
        console.error( `Database search failed: ${error}` )
        throw new Error( 'Failed to search for the email in the database' )
    }
}

async function getUserByUsername(username: string) {
    try {
        const result = await sql`
            SELECT * FROM users WHERE username = ${username}
        `;
        return result[0]
    } catch (error) {
        console.error( `Database search failed: ${error}` )
        throw new Error( 'Failed to search for the username in the database' )
    }
}