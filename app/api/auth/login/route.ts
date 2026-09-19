import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { verifyPassword, createSession, setSessionCookie, logAudit } from '@/lib/auth'

export async function POST(request: NextRequest) {
  await initDb()
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const { rows } = await query(
      'SELECT id, email, password_hash, status FROM users WHERE email = $1',
      [email.toLowerCase()],
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
    }
    const user = rows[0]
    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'تم تعليق هذا الحساب. تواصل مع الدعم.' }, { status: 403 })
    }
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const ip = request.headers.get('x-forwarded-for') ?? undefined
    const ua = request.headers.get('user-agent') ?? undefined
    const token = await createSession(user.id, ip, ua)
    await setSessionCookie(token)

    await logAudit(user.id, 'user.login', 'user', user.id, {}, ip ?? undefined)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'فشل تسجيل الدخول' }, { status: 500 })
  }
}
