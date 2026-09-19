import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, logActivity } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  await initDb()

  try {
    const body = await request.json()
    const {
      emailVisibility, phoneVisibility, countryVisibility,
      projectsVisibility, postsVisibility, imagesVisibility,
      appsVisibility, activityVisibility, worksVisibility, profileVisibility,
    } = body

    const fields = {
      email_visibility: emailVisibility,
      phone_visibility: phoneVisibility,
      country_visibility: countryVisibility,
      projects_visibility: projectsVisibility,
      posts_visibility: postsVisibility,
      images_visibility: imagesVisibility,
      apps_visibility: appsVisibility,
      activity_visibility: activityVisibility,
      works_visibility: worksVisibility,
      profile_visibility: profileVisibility,
    }

    const validVisibilities = ['public', 'registered', 'team', 'private']
    const updates = Object.entries(fields).filter(
      ([, v]) => v && validVisibilities.includes(v),
    )

    if (updates.length === 0) {
      return NextResponse.json({ error: 'لا توجد إعدادات صالحة' }, { status: 400 })
    }

    const setClauses = updates.map(([k], i) => `${k} = $${i + 2}`).join(', ')
    const values = updates.map(([, v]) => v)

    await query(
      `INSERT INTO user_privacy (user_id, ${updates.map(([k]) => k).join(', ')})
       VALUES ($1, ${updates.map((_, i) => `$${i + 2}`).join(', ')})
       ON CONFLICT (user_id) DO UPDATE SET ${setClauses}`,
      [user.id, ...values],
    )

    await logActivity(user.id, 'privacy_updated', 'تم تحديث إعدادات الخصوصية', {}, 'private')

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Privacy update error:', e)
    return NextResponse.json({ error: 'فشل تحديث الخصوصية' }, { status: 500 })
  }
}
