import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { host_element, adjacent_element, exposure } = body || {};

    if (!host_element || !adjacent_element || !exposure) {
      return NextResponse.json(
        { error: 'host_element, adjacent_element, exposure are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT d.id, d.title, d.category, d.tags, d.description,
             r.host_element, r.adjacent_element, r.exposure
      FROM detail_usage_rules r
      JOIN details d ON d.id = r.detail_id
      WHERE r.host_element ILIKE $1
        AND r.adjacent_element ILIKE $2
        AND r.exposure ILIKE $3
      LIMIT 1
      `,
      [host_element, adjacent_element, exposure]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        detail: null,
        explanation: 'No matching detail found for given context',
      });
    }

    const row = result.rows[0];

    return NextResponse.json({
      detail: {
        id: row.id,
        title: row.title,
        category: row.category,
        tags: row.tags,
        description: row.description,
      },
      explanation: `Matched based on host_element='${row.host_element}', adjacent_element='${row.adjacent_element}', exposure='${row.exposure}'.`,
    });
  } catch (err: any) {
    console.error('DB Error in suggest:', err.message);
    return NextResponse.json({ error: 'Database suggestion failed' }, { status: 500 });
  }
}
