import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('Title');
 
  try {
    if (!title ) throw new Error('Title required');
    await sql`INSERT INTO Tapes (Title) VALUES (${title});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
 
  const tapes = await sql`SELECT * FROM Tapes;`;
  return NextResponse.json({ tapes }, { status: 200 });
}