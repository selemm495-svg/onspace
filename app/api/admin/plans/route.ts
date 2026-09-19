import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, logAudit } from '@/lib/auth'
import { hasRole, hasPermission } from '@/lib/rbac'

export async function GET() {
  await initDb()
  const { rows } = await query('SELECT * FROM plans ORDER BY sort_order')
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const canManage = hasRole(user, 'admin', 'superadmin') || await hasPermission(user, 'admin.plans.manage')
  if (!canManage) return NextResponse.json({ error: 'صلاحية مرفوضة' }, { status: 403 })

  await initDb()
  const body = await request.json()
  const ip = request.headers.get('x-forwarded-for') ?? undefined

  const { name, price, period, description, features, credits, maxProjects, maxTeamMembers, storageMB, canExport, canShare, canCollaborate, active, sortOrder } = body

  if (!name) return NextResponse.json({ error: 'اسم الخطة مطلوب' }, { status: 400 })

  const { rows } = await query(
    `INSERT INTO plans (name, price, period, description, features, credits, max_projects, max_team_members, storage_mb, can_export, can_share, can_collaborate, active, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
    [name, price ?? 0, period ?? 'monthly', description ?? '', JSON.stringify(features ?? []), credits ?? 0, maxProjects ?? 5, maxTeamMembers ?? 1, storageMB ?? 100, canExport ?? false, canShare ?? true, canCollaborate ?? false, active ?? true, sortOrder ?? 0],
  )

  await logAudit(user.id, 'admin.plan.create', 'plan', rows[0].id, { name }, ip)
  return NextResponse.json(rows[0], { status: 201 })
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const canManage = hasRole(user, 'admin', 'superadmin') || await hasPermission(user, 'admin.plans.manage')
  if (!canManage) return NextResponse.json({ error: 'صلاحية مرفوضة' }, { status: 403 })

  await initDb()
  const body = await request.json()
  const ip = request.headers.get('x-forwarded-for') ?? undefined
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ error: 'معرف الخطة مطلوب' }, { status: 400 })

  const allowedFields = ['name', 'price', 'period', 'description', 'features', 'credits', 'max_projects', 'max_team_members', 'storage_mb', 'can_export', 'can_share', 'can_collaborate', 'active', 'sort_order']
  const updates: string[] = []
  const values: unknown[] = []
  let idx = 1

  for (const [key, val] of Object.entries(fields)) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = $${idx}`)
      values.push(key === 'features' ? JSON.stringify(val) : val)
      idx++
    }
  }

  if (updates.length === 0) return NextResponse.json({ error: 'لا توجد تحديثات' }, { status: 400 })

  values.push(id)
  await query(`UPDATE plans SET ${updates.join(', ')} WHERE id = $${idx}`, values)

  await logAudit(user.id, 'admin.plan.update', 'plan', id, fields, ip)
  return NextResponse.json({ ok: true })
}
