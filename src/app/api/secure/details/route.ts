import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const email = request.headers.get('x-user-email');

  if (!email) {
    return NextResponse.json(
      { error: 'Missing header: x-user-email' },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    // Get user role for response context
    const userRes = await client.query(
      'SELECT id, email, role FROM users WHERE email=$1',
      [email]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json(
        { error: 'User not found in users table' },
        { status: 401 }
      );
    }

    const user = userRes.rows[0];

    // Start Transaction for RLS simulation
    await client.query('BEGIN');

    // Set RLS config
    await client.query("SELECT set_config('app.current_user_email', $1, true)", [
      email,
    ]);

    // Query details with Application-Layer filtering
    let queryText = 'SELECT id, title, category, tags, description, source, user_id FROM details';
    const params: any[] = [];

    if (user.role === 'admin') {
      queryText += ' ORDER BY id';
    } else if (user.role === 'architect') {
      queryText += ' WHERE source = $1 OR (source = $2 AND user_id = $3) ORDER BY id';
      params.push('standard', 'user_project', user.id);
    } else if (user.role === 'intern') {
      queryText += ' WHERE source = $1 ORDER BY id';
      params.push('standard');
    } else {
         queryText += ' WHERE 1=0';
    }

    const result = await client.query(queryText, params);

    await client.query('COMMIT');

    return NextResponse.json({ as_user: user, rows: result.rows });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
