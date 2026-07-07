import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
  console.log('Connecting to MySQL host...');
  
  // Connect without specifying database first, to ensure we can create it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    console.log('Database schema applied successfully.');

    await connection.end();

    console.log('Seeding initial data...');
    // Dynamically import seed.js to run the seed script
    await import('./seed.js');
  } catch (err) {
    console.error('Database setup failed:', err);
    try {
      await connection.end();
    } catch (_) {}
    process.exit(1);
  }
}

runSetup();
