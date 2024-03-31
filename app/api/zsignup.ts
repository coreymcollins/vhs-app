import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import sql from '../components/database'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    if ( 'POST' === req.method ) {
        const {username, email, password} = req.body

        try {
            // Hash the password.
            const hashedPassword = await bcrypt.hash( password, 10 )

            // Add the record to the table.
            await sql`
                INSERT INTO users (username, email, password)
                VALUES (${username}, ${email}, ${hashedPassword})
            `;

            res.status(201).json({ message: 'User created successfully' })
        } catch (error) {
            console.error( 'Error creating user', error )
            res.status(500).json({ message: 'Internal Server Error' })
        }
    } else {
        res.setHeader( 'Allow', ['POST'] )
        res.status(405).json({ message: `Method ${req.method} not allowed`})
    }
}