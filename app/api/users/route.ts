import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, validateUsername, logActivity } from '@/lib/auth'

export async function GET(request: NextRequest) {
  await initDb()
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'اسم المستخدم مطلوب' }, { status: 400 })
  }

  const currentUser = await getCurrentUser()

  const { rows } = await query(
    `SELECT u.id, u.name, u.username, u.bio, u.profession, u.specialty,
            u.job_title, u.country, u.website, u.social_links, u.avatar_url,
            u.cover_url, u.user_type, u.created_at, u.plan_id,
            p.name AS plan_name
     FROM users u LEFT JOIN plans p ON p.id = u.plan_id
     WHERE u.username = $1 AND u.status = 'active'`,
    [username],
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
  }

  const profileUser = rows[0]

  // Get privacy settings
  const { rows: privacyRows } = await query('SELECT * FROM user_privacy WHERE user_id = $1', [profileUser.id])
  const privacy = privacyRows[0] ?? {}

  // If profile is private and not the owner
  if (privacy.profile_visibility === 'private' && currentUser?.id !== profileUser.id) {
    return NextResponse.json({ error: 'هذا الملف الشخصي خاص' }, { status: 403 })
  }

  // Build public profile based on privacy
  const isOwner = currentUser?.id === profileUser.id
  const isRegistered = !!currentUser

  function canSee(vis: string | undefined): boolean {
    if (isOwner) return true
    if (!vis || vis === 'public') return true
    if (vis === 'registered' && isRegistered) return true
    return false
  }

  const publicProfile: Record<string, unknown> = {
    id: profileUser.id,
    name: profileUser.name,
    username: profileUser.username,
    bio: profileUser.bio,
    profession: profileUser.profession,
    specialty: profileUser.specialty,
    jobTitle: profileUser.job_title,
    website: canSee(privacy.country_visibility) || true ? profileUser.website : null,
    socialLinks: profileUser.social_links ?? {},
    avatarUrl: profileUser.avatar_url,
    coverUrl: profileUser.cover_url,
    userType: profileUser.user_type,
    createdAt: profileUser.created_at,
    planName: profileUser.plan_name,
    country: canSee(privacy.country_visibility) ? profileUser.country : null,
  }

  // Only show email/phone if explicitly public
  if (canSee(privacy.email_visibility)) {
    const { rows: eRows } = await query('SELECT email FROM users WHERE id = $1', [profileUser.id])
    publicProfile.email = eRows[0]?.email ?? null
  }
  if (canSee(privacy.phone_visibility)) {
    const { rows: pRows } = await query('SELECT phone, phone_country_code FROM users WHERE id = $1', [profileUser.id])
    publicProfile.phone = pRows[0]?.phone ?? null
    publicProfile.phoneCountryCode = pRows[0]?.phone_country_code ?? null
  }

  // Stats
  const { rows: followerRows } = await query('SELECT COUNT(*) as count FROM follows WHERE followee_id = $1', [profileUser.id])
  const { rows: followingRows } = await query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [profileUser.id])
  const { rows: projectRows } = await query('SELECT COUNT(*) as count FROM projects WHERE user_id = $1', [profileUser.id])
  const { rows: viewRows } = await query('SELECT COUNT(*) as count FROM profile_views WHERE profile_user_id = $1', [profileUser.id])

  publicProfile.stats = {
    followers: parseInt(followerRows[0]?.count ?? '0'),
    following: parseInt(followingRows[0]?.count ?? '0'),
    projects: parseInt(projectRows[0]?.count ?? '0'),
    profileViews: parseInt(viewRows[0]?.count ?? '0'),
  }

  // Is current user following?
  if (currentUser) {
    const { rows: followRows } = await query(
      'SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2',
      [currentUser.id, profileUser.id],
    )
    publicProfile.isFollowing = followRows.length > 0
  } else {
    publicProfile.isFollowing = false
  }

  // Activity (if visible)
  if (canSee(privacy.activity_visibility)) {
    const { rows: activityRows } = await query(
      'SELECT type, description, created_at FROM user_activity WHERE user_id = $1 AND visibility = $2 ORDER BY created_at DESC LIMIT 20',
      [profileUser.id, isOwner ? 'private' : 'public'],
    )
    publicProfile.activity = activityRows
  }

  // Projects (if visible)
  if (canSee(privacy.projects_visibility)) {
    const { rows: projectDataRows } = await query(
      'SELECT id, title, type, status, created_at FROM projects WHERE user_id = $1 ORDER BY created_at DESC LIMIT 12',
      [profileUser.id],
    )
    publicProfile.projects = projectDataRows
  }

  // Record profile view
  if (currentUser && currentUser.id !== profileUser.id) {
    await query(
      'INSERT INTO profile_views (profile_user_id, viewer_id) VALUES ($1, $2)',
      [profileUser.id, currentUser.id],
    )
  }

  return NextResponse.json(publicProfile)
}
