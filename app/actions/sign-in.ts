import bcrypt from 'bcrypt'
import sql from '@/app/components/database'

export interface UserData {
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