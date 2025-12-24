import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running database migrations...');
    
    // Start transaction
    await client.query('BEGIN');

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`  [${i + 1}/${statements.length}] Executing...`);
        try {
          await client.query(statement);
        } catch (error) {
          // Ignore "already exists" errors
          if (error.message.includes('already exists')) {
            console.log(`  ⚠️  Skipped (already exists)`);
          } else {
            throw error;
          }
        }
      }
    }

    // Commit transaction
    await client.query('COMMIT');

    console.log('✅ Database migrations completed successfully!');
    console.log('');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - folders');
    console.log('  - files');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Check DATABASE_URL in .env');
    console.error('  2. Ensure database is accessible');
    console.error('  3. Verify database user has CREATE permissions');
    console.error('');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
