import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { CheckPassword, GetUserByUsername } from '@/app/actions/sign-in'

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

                const user = await GetUserByUsername( credentials.username )

                if ( user && await CheckPassword( credentials.password, user.password_hash ) ) {
                    return { id: user.user_id, name: user.username }
                } else {
                    return null
                }
            }
        })
    ],
}