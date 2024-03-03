import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const result =
      await sql`CREATE TABLE tapes ( barcode text, title varchar(255), description text, genre varchar(255), year int );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}