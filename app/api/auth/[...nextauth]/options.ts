import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { checkPassword, getUserByUsername } from '@/app/actions/sign-in'

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "password"
                },
            },
            async authorize( credentials ) {

                if ( undefined === credentials ) {
                    return null
                }

                const user = await getUserByUsername( credentials.username )

                if ( user && await checkPassword( credentials.password, user.password_hash ) ) {
                    return {
                        id: user.user_id,
                        name: user.username,
                        user_role: user.user_role,
                    }
                } else {
                    return null
                }
            }
        })
    ],
}