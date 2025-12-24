import pool from '../database/db.js';

async function simpleMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running simple database migrations...');
    
    // 1. Create UUID extension
    console.log('  [1/6] Creating UUID extension...');
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
    // 2. Create users table
    console.log('  [2/6] Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        telegram_id BIGINT UNIQUE NOT NULL,
        username VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 3. Create folders table
    console.log('  [3/6] Creating folders table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS folders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, parent_id, user_id)
      )
    `);
    
    // 4. Create files table
    console.log('  [4/6] Creating files table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS files (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(500) NOT NULL,
        original_name VARCHAR(500) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        mime_type VARCHAR(100),
        size_bytes BIGINT NOT NULL,
        size_display VARCHAR(50),
        folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        telegram_file_id VARCHAR(500) NOT NULL,
        telegram_message_id BIGINT NOT NULL,
        telegram_file_unique_id VARCHAR(500),
        tags TEXT[],
        description TEXT,
        is_favorite BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `);
    
    // 5. Create indexes
    console.log('  [5/6] Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);
      CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
      CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);
      CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
      CREATE INDEX IF NOT EXISTS idx_files_is_deleted ON files(is_deleted);
      CREATE INDEX IF NOT EXISTS idx_files_telegram_file_id ON files(telegram_file_id);
      CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
      CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
    `);
    
    // 6. Create update trigger function
    console.log('  [6/6] Creating triggers...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
      CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_files_updated_at ON files;
      CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    console.log('✅ Database migration completed successfully!');
    console.log('');
    console.log('📊 Tables created:');
    console.log('   ✓ users');
    console.log('   ✓ folders');
    console.log('   ✓ files');
    console.log('');
    
    // Verify tables exist
    const result = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'folders', 'files')
      ORDER BY tablename
    `);
    
    console.log('📋 Verified tables in database:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.tablename}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('');
    console.error('Full error:', error);
    console.error('');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

simpleMigration();
