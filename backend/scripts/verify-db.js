import pool from '../database/db.js';

async function verifyDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying database setup...');
    console.log('');
    
    // Check connection
    console.log('1. Testing database connection...');
    await client.query('SELECT 1');
    console.log('   ✅ Connected to database');
    console.log('');
    
    // Check if tables exist
    console.log('2. Checking tables...');
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'folders', 'files')
      ORDER BY tablename
    `);
    
    const expectedTables = ['files', 'folders', 'users'];
    const foundTables = tables.rows.map(r => r.tablename);
    
    expectedTables.forEach(tableName => {
      if (foundTables.includes(tableName)) {
        console.log(`   ✅ ${tableName}`);
      } else {
        console.log(`   ❌ ${tableName} (missing)`);
      }
    });
    console.log('');
    
    if (foundTables.length === expectedTables.length) {
      // Check table structures
      console.log('3. Checking table structures...');
      
      // Check users table
      const usersColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);
      console.log(`   ✅ users (${usersColumns.rows.length} columns)`);
      
      // Check folders table
      const foldersColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'folders'
        ORDER BY ordinal_position
      `);
      console.log(`   ✅ folders (${foldersColumns.rows.length} columns)`);
      
      // Check files table
      const filesColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'files'
        ORDER BY ordinal_position
      `);
      console.log(`   ✅ files (${filesColumns.rows.length} columns)`);
      console.log('');
      
      // Check for data
      console.log('4. Checking data...');
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      const folderCount = await client.query('SELECT COUNT(*) FROM folders');
      const fileCount = await client.query('SELECT COUNT(*) FROM files');
      
      console.log(`   📊 Users: ${userCount.rows[0].count}`);
      console.log(`   📊 Folders: ${folderCount.rows[0].count}`);
      console.log(`   📊 Files: ${fileCount.rows[0].count}`);
      console.log('');
      
      console.log('✅ Database is properly set up!');
      console.log('');
      console.log('🚀 You can now:');
      console.log('   1. Start backend: npm run dev');
      console.log('   2. Test API: curl http://localhost:3001/api/files -H "X-Telegram-Id: 934561422"');
      console.log('   3. Use the frontend to upload files!');
      
    } else {
      console.log('❌ Database setup incomplete!');
      console.log('');
      console.log('Missing tables:', expectedTables.filter(t => !foundTables.includes(t)));
      console.log('');
      console.log('Run migration:');
      console.log('   npm run db:migrate');
      console.log('or:');
      console.log('   npm run db:migrate-simple');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Check if DATABASE_URL is correct in .env');
    console.error('  2. Verify database is accessible');
    console.error('  3. Run migration: npm run db:migrate');
    console.error('');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyDatabase();
