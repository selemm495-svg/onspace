import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, validateUsername, logActivity } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  await initDb()

  const { rows: privacyRows } = await query('SELECT * FROM user_privacy WHERE user_id = $1', [user.id])
  const privacy = privacyRows[0] ?? {}

  const { rows: followerRows } = await query(
    'SELECT COUNT(*) as count FROM follows WHERE followee_id = $1', [user.id],
  )
  const { rows: followingRows } = await query(
    'SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [user.id],
  )
  const { rows: projectRows } = await query(
    'SELECT COUNT(*) as count FROM projects WHERE user_id = $1', [user.id],
  )
  const { rows: activityRows } = await query(
    'SELECT COUNT(*) as count FROM user_activity WHERE user_id = $1', [user.id],
  )

  return NextResponse.json({
    user,
    privacy,
    stats: {
      followers: parseInt(followerRows[0]?.count ?? '0'),
      following: parseInt(followingRows[0]?.count ?? '0'),
      projects: parseInt(projectRows[0]?.count ?? '0'),
      activity: parseInt(activityRows[0]?.count ?? '0'),
    },
  })
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name, username, bio, profession, specialty, jobTitle, country,
      phoneCountryCode, phone, timezone, language, userType, website, socialLinks,
    } = body

    let finalUsername = user.username
    if (username && username !== user.username) {
      const check = validateUsername(username)
      if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 })
      const { rows: existing } = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, user.id])
      if (existing.length > 0) return NextResponse.json({ error: 'اسم المستخدم محجوز' }, { status: 409 })
      finalUsername = username
    }

    await query(
      `UPDATE users SET
        name = $1, username = $2, bio = $3, profession = $4, specialty = $5,
        job_title = $6, country = $7, phone_country_code = $8, phone = $9,
        timezone = $10, language = $11, user_type = $12, website = $13,
        social_links = $14, updated_at = NOW()
       WHERE id = $15`,
      [
        name ?? user.name, finalUsername, bio ?? null, profession ?? null,
        specialty ?? null, jobTitle ?? null, country ?? null,
        phoneCountryCode ?? null, phone ?? null, timezone ?? user.timezone,
        language ?? 'ar', userType ?? null, website ?? null,
        JSON.stringify(socialLinks ?? {}), user.id,
      ],
    )

    await logActivity(user.id, 'profile_updated', 'تم تحديث الملف الشخصي')

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Profile update error:', e)
    return NextResponse.json({ error: 'فشل تحديث الملف الشخصي' }, { status: 500 })
  }
}
