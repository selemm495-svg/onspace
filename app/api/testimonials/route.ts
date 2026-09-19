import { NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'

export async function GET() {
  await initDb()
  try {
    const { rows } = await query('SELECT * FROM testimonials ORDER BY id')
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json([])
  }
}
