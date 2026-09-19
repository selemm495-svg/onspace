import { query } from '@/lib/db'
import type { SafeUser } from '@/lib/auth'

export type Permission =
  | 'admin.access'
  | 'admin.users.view'
  | 'admin.users.edit'
  | 'admin.users.suspend'
  | 'admin.users.delete'
  | 'admin.plans.manage'
  | 'admin.subscriptions.manage'
  | 'admin.credits.manage'
  | 'admin.projects.manage'
  | 'admin.audit.view'
  | 'admin.technical.view'

export const ALL_PERMISSIONS: Permission[] = [
  'admin.access',
  'admin.users.view',
  'admin.users.edit',
  'admin.users.suspend',
  'admin.users.delete',
  'admin.plans.manage',
  'admin.subscriptions.manage',
  'admin.credits.manage',
  'admin.projects.manage',
  'admin.audit.view',
  'admin.technical.view',
]

export function hasRole(user: SafeUser | null, ...roles: string[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

export async function hasPermission(user: SafeUser | null, perm: Permission): Promise<boolean> {
  if (!user) return false
  if (user.role === 'superadmin') return true
  if (user.role === 'admin' && ALL_PERMISSIONS.includes(perm)) return true
  try {
    const { rows } = await query(
      `SELECT 1 FROM user_permissions
       WHERE user_id = $1 AND permission = $2
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [user.id, perm],
    )
    return rows.length > 0
  } catch {
    return false
  }
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const { rows } = await query(
      `SELECT permission FROM user_permissions
       WHERE user_id = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId],
    )
    return rows.map((r: { permission: string }) => r.permission)
  } catch {
    return []
  }
}

export async function grantPermission(userId: string, perm: string, expiresAt?: Date) {
  await query(
    'INSERT INTO user_permissions (user_id, permission, expires_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [userId, perm, expiresAt ?? null],
  )
}

export async function revokePermission(userId: string, perm: string) {
  await query(
    'DELETE FROM user_permissions WHERE user_id = $1 AND permission = $2',
    [userId, perm],
  )
}
