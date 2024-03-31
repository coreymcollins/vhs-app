import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  // try {
  //   const result =
  //     await sql`CREATE TABLE tapes ( id SERIAL PRIMARY KEY, barcode text, title varchar(255), description text, genre varchar(255), year int, coverfront bytea );`;
  //   return NextResponse.json({ result }, { status: 200 });
  // } catch (error) {
  //   return NextResponse.json({ error }, { status: 500 });
  // }
}

// CREATE TABLE tapes ( tape_id SERIAL PRIMARY KEY, barcode text UNIQUE NOT NULL, title varchar(255) NOT NULL, description text NOT NULL, year int NOT NULL, coverfront bytea );

// CREATE TABLE genres ( genre_id SERIAL PRIMARY KEY, genre_name varchar(255) UNIQUE NOT NULL );

// CREATE TABLE tapes_genres ( tape_genre_id SERIAL PRIMARY KEY, tape_id INTEGER REFERENCES tapes(tape_id), genre_id INTEGER REFERENCES genres(genre_id) );

// CREATE EXTENSION IF NOT EXISTS pgcrypto;

// CREATE TABLE users ( user_id SERIAL PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(150) UNIQUE NOT NULL, password_hash varchar(255) NOT NULL );

// CREATE TABLE users_tapes ( user_tape_id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(user_id), tape_id INTEGER REFERENCES tapes(tape_id) );

// INSERT INTO genres (genre_name) VALUES ('Comedy'), ('Horror'), ('Family'), ('Children\'s'), ('Biography'), ('Documentary'), ('Blaxploitation'), ('Western'), ('Wrestling'), ('Sports');

// genre_id |   genre_name   
// ----------+----------------
//         1 | Comedy
//         2 | Horror
//         3 | Family
//         4 | Children's
//         5 | Biography
//         6 | Documentary
//         7 | Blaxploitation
//         8 | Western
//         9 | Wrestling
//        10 | Sports