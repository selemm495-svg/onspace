import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  await initDb()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  try {
    if (type) {
      const { rows } = await query(
        'SELECT * FROM projects WHERE type = $1 ORDER BY created_at DESC LIMIT 12',
        [type],
      )
      return NextResponse.json(rows)
    }
    const { rows } = await query('SELECT * FROM projects ORDER BY created_at DESC LIMIT 12')
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  await initDb()
  try {
    const body = await request.json()
    const { prompt, type, platform, backend, visibility, framework } = body
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'الطلب فارغ' }, { status: 400 })
    }
    const title = prompt.slice(0, 50) + (prompt.length > 50 ? '…' : '')
    const { rows } = await query(
      `INSERT INTO projects (prompt, title, type, platform, backend, visibility, framework)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        prompt,
        title,
        type || 'web',
        platform || 'web',
        backend || 'cloud',
        visibility || 'public',
        framework || null,
      ],
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل إنشاء المشروع' }, { status: 500 })
  }
}
