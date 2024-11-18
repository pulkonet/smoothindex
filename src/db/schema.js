import { sql } from '@vercel/postgres';

export async function createTables() {
    try {
        // Create users table
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture TEXT,
        refresh_token TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Create sites table to track user's sites
        await sql`
      CREATE TABLE IF NOT EXISTS user_sites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        site_url TEXT NOT NULL,
        permission_level VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, site_url)
      );
    `;

        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
} 