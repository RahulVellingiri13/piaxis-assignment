import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'q is required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, title, category, tags, description
      FROM details
      WHERE title ILIKE $1 OR tags ILIKE $1 OR description ILIKE $1
      ORDER BY id
      `,
      [`%${q}%`]
    );
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error('DB Error in search:', err.message);
    return NextResponse.json({ error: 'Database search failed' }, { status: 500 });
  }
}
