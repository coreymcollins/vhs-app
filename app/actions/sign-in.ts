import bcrypt from 'bcrypt'
import sql from '@/app/components/database'

export interface UserData {
    username: string;
    email: string;
    password_hash: string;
}

export async function getUserByUsername(username: string) {
    try {
        const result = await sql`
            SELECT * FROM users WHERE username = ${username}
        `;

        if( result.length > 0 ) {
            return result[0]
        } else {
            return null
        }
    } catch (error) {
        console.error(`Error searching for user by username: ${username}`)
        throw error
    }
}

export async function checkPassword(password: string, password_hash: string) {
    const passwordMatch = await bcrypt.compare(password, password_hash);

    if ( ! passwordMatch ) {
        return null
    }

    try {
        const result = await sql`
            SELECT * FROM users WHERE password_hash = ${password_hash}
        `;

        if( result.length > 0 ) {
            return result[0]
        } else {
            return null
        }
    } catch (error) {
        console.error(`Error searching for user by password_hash: ${password_hash}`)
        throw error
    }
}
