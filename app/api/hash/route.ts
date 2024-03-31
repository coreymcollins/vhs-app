import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt'

export async function postHandler( req: NextApiRequest, res: NextApiResponse ) {
    console.log( 'Request body:', req.body )
    if ( req.method === 'POST' ) {
        const {password} = req.body

        try {
            // Hash the password.
            const hashedPassword = await bcrypt.hash( password, 10 )

            // Send the hashed password back to the frontend.
            res.status(200).json({hashedPassword})
        } catch (error) {
            console.error( 'Error hashing password:', error )
            res.status(500).json({ message: 'Internal server error' })
        }
    } else {
        res.setHeader( 'Allow', ['POST'] )
        res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
}