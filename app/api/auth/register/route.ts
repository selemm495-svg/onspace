import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { hashPassword, createSession, setSessionCookie, validateUsername, validateEmail, logAudit, logActivity } from '@/lib/auth'

export async function POST(request: NextRequest) {
  await initDb()
  try {
    const body = await request.json()
    const { email, password, name, username } = body

    if (!email || !password || !name || !username) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صالح' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
    }
    const usernameCheck = validateUsername(username)
    if (!usernameCheck.valid) {
      return NextResponse.json({ error: usernameCheck.error }, { status: 400 })
    }

    const { rows: existing } = await query('SELECT id FROM users WHERE email = $1 OR username = $1', [username])
    if (existing.length > 0) {
      return NextResponse.json({ error: 'اسم المستخدم محجوز' }, { status: 409 })
    }
    const { rows: existingEmail } = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existingEmail.length > 0) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 })
    }

    const passwordHash = hashPassword(password)

    // First registered user becomes superadmin
    const { rows: userCount } = await query('SELECT COUNT(*) as count FROM users')
    const isFirstUser = parseInt(userCount[0].count) === 0
    const role = isFirstUser ? 'superadmin' : 'user'
    const planId = isFirstUser ? 3 : 1 // First user gets Team plan
    const credits = isFirstUser ? 50000 : 1500

    const { rows } = await query(
      `INSERT INTO users (email, password_hash, name, username, role, plan_id, credits)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, name, username`,
      [email.toLowerCase(), passwordHash, name, username, role, planId, credits],
    )
    const user = rows[0]

    // Create default privacy settings
    await query('INSERT INTO user_privacy (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [user.id])

    const ip = request.headers.get('x-forwarded-for') ?? undefined
    const ua = request.headers.get('user-agent') ?? undefined

    if (isFirstUser) {
      await logAudit(user.id, 'system.first_admin', 'user', user.id, { role: 'superadmin' }, ip)
    }

    const token = await createSession(user.id, ip, ua)
    await setSessionCookie(token)

    await logActivity(user.id, 'account_created', 'تم إنشاء الحساب')
    await logAudit(user.id, 'user.register', 'user', user.id, { username }, ip ?? undefined)

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, username: user.username }, { status: 201 })
  } catch (e) {
    console.error('Register error:', e)
    return NextResponse.json({ error: 'فشل إنشاء الحساب' }, { status: 500 })
  }
}
