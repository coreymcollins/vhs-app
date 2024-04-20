import bcrypt from 'bcrypt'
import sql from '@/app/components/database'

export interface UserData {
    username: string;
    email: string;
    password_hash: string;
}

export async function signIn(type: string, formData: FormData): Promise<UserData> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const userData = await getUserByEmail(email)

    if (!userData) {
        throw { type: 'CredentialsSignIn', message: 'Invalid credentials' };
    }

    const passwordMatch = await bcrypt.compare(password, userData.password_hash);

    if (!passwordMatch) {
        throw { type: 'CredentialsSignIn', message: 'Invalid credentials' };
    }

    return userData;
}

async function getUserByEmail(email: string) {
    try {
        const result = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        if( result.length > 0 ) {
            const userData: UserData = {
                username: result[0].username,
                email: result[0].email,
                password_hash: result[0].password_hash,
            }
            return userData
        } else {
            return null
        }
    } catch (error) {
        console.error(`Error searching for user by email: ${email}`)
        throw error
    }
}

export async function GetUserByUsername(username: string) {
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

export async function CheckPassword(password: string, password_hash: string) {
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
