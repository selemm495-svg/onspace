import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'

export async function POST(request: NextRequest) {
  await initDb()
  try {
    const { email } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'بريد إلكتروني غير صالح' }, { status: 400 })
    }
    await query(
      'INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email],
    )
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل الاشتراك' }, { status: 500 })
  }
}
