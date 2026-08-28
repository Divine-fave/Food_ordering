// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pg;

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });

// export default pool;

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testConnection() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    console.log('PostgreSQL connected at:', result.rows[0].now);
  } finally {
    client.release();
  }
}