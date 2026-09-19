import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { validateUsername, getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  await initDb()
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ available: false, error: 'اسم المستخدم مطلوب' })
  }

  const check = validateUsername(username)
  if (!check.valid) {
    return NextResponse.json({ available: false, error: check.error })
  }

  const user = await getCurrentUser()
  const { rows } = await query(
    'SELECT id FROM users WHERE username = $1 AND id != $2',
    [username, user?.id ?? '00000000-0000-0000-0000-000000000000'],
  )

  return NextResponse.json({
    available: rows.length === 0,
    error: rows.length > 0 ? 'اسم المستخدم محجوز' : null,
  })
}
