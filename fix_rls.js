const path = require('path');
// specific hack for this environment if node_modules are present
module.paths.push(path.join(__dirname, 'node_modules'));
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixRLS() {
  const client = await pool.connect();
  try {
    console.log('Starting RLS Fix...');
    await client.query('BEGIN');

    // 1. Force RLS (CRITICAL: prevents table owner from bypassing policies)
    console.log('Forcing RLS on details table...');
    await client.query('ALTER TABLE details FORCE ROW LEVEL SECURITY;');

    // 2. Update Role Constraint to allow 'intern'
    console.log('Updating role constraints...');
    await client.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;');
    await client.query("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'architect', 'intern'));");

    // 3. Update Bob to 'intern'
    console.log("Updating Bob to 'intern'...");
    await client.query("UPDATE users SET role = 'intern' WHERE email = 'bob@example.com';");

    // 4. Create Intern Policy (Standard Source Only)
    console.log('Creating Intern Policy...');
    await client.query('DROP POLICY IF EXISTS intern_access ON details;');
    await client.query(`
      CREATE POLICY intern_access ON details
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM users u
          WHERE u.email = current_user_email() 
          AND u.role = 'intern'
          AND details.source = 'standard'
        )
      );
    `);

    await client.query('COMMIT');
    console.log('RLS Fix Applied Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error applying fix:', err);
  } finally {
    client.release();
    pool.end();
  }
}

fixRLS();
