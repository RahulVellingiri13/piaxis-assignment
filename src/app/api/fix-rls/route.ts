
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Force RLS
    await client.query('ALTER TABLE details FORCE ROW LEVEL SECURITY;'); 

    // 2. Update Role Constraint 
    await client.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;');
    await client.query("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'architect', 'intern'));");

    // 3. Update Bob
    await client.query("UPDATE users SET role = 'intern' WHERE email = 'bob@example.com';");

    // 4. Create Intern Policy
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
    return NextResponse.json({ success: true, message: 'RLS fixed and Bob updated to Intern' });
  } catch (err: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
