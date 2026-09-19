import { Pool } from 'pg'
import { testimonials as seedTestimonials, communityProjects as seedCommunity } from '@/lib/data'
import { seedPlans } from '@/lib/plans'

const connectionString =
  process.env.DATABASE_URL || 'postgresql://onspace:onspace@localhost:5432/onspace'

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined
  // eslint-disable-next-line no-var
  var __dbInitialized: boolean | undefined
}

const pool = global.__dbPool ?? new Pool({ connectionString, max: 10 })
if (process.env.NODE_ENV !== 'production') global.__dbPool = pool

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect()
  try {
    return await client.query(text, params as never[])
  } finally {
    client.release()
  }
}

export async function initDb() {
  if (global.__dbInitialized) return
  try {
    await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`)

    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        prompt TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'web',
        platform TEXT DEFAULT 'web',
        backend TEXT DEFAULT 'cloud',
        visibility TEXT DEFAULT 'public',
        framework TEXT,
        status TEXT DEFAULT 'ready',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS community_projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        gradient TEXT NOT NULL,
        emoji_hint TEXT NOT NULL
      );
    `)

    await query(`
      -- Users
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'user',
        status TEXT NOT NULL DEFAULT 'active',
        phone TEXT,
        phone_country_code TEXT,
        country TEXT,
        timezone TEXT DEFAULT 'Africa/Cairo',
        language TEXT DEFAULT 'ar',
        user_type TEXT,
        profession TEXT,
        specialty TEXT,
        job_title TEXT,
        bio TEXT,
        website TEXT,
        social_links JSONB DEFAULT '{}',
        avatar_url TEXT,
        cover_url TEXT,
        credits INTEGER DEFAULT 1500,
        plan_id INTEGER DEFAULT 1,
        subscription_status TEXT DEFAULT 'active',
        subscription_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Plans
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        price NUMERIC NOT NULL DEFAULT 0,
        period TEXT NOT NULL DEFAULT 'monthly',
        description TEXT,
        features JSONB DEFAULT '[]',
        credits INTEGER DEFAULT 0,
        max_projects INTEGER DEFAULT 5,
        max_team_members INTEGER DEFAULT 1,
        storage_mb INTEGER DEFAULT 100,
        can_export BOOLEAN DEFAULT false,
        can_share BOOLEAN DEFAULT true,
        can_collaborate BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0
      );

      -- Subscriptions
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id INTEGER NOT NULL REFERENCES plans(id),
        status TEXT NOT NULL DEFAULT 'active',
        started_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- User sessions
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        ip TEXT,
        user_agent TEXT
      );

      -- Follows
      CREATE TABLE IF NOT EXISTS follows (
        follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (follower_id, followee_id)
      );

      -- User activity
      CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        description TEXT,
        metadata JSONB DEFAULT '{}',
        visibility TEXT DEFAULT 'public',
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- User privacy settings
      CREATE TABLE IF NOT EXISTS user_privacy (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        email_visibility TEXT DEFAULT 'private',
        phone_visibility TEXT DEFAULT 'private',
        country_visibility TEXT DEFAULT 'public',
        projects_visibility TEXT DEFAULT 'public',
        posts_visibility TEXT DEFAULT 'public',
        images_visibility TEXT DEFAULT 'public',
        apps_visibility TEXT DEFAULT 'public',
        activity_visibility TEXT DEFAULT 'public',
        works_visibility TEXT DEFAULT 'public',
        profile_visibility TEXT DEFAULT 'public'
      );

      -- User permissions (RBAC)
      CREATE TABLE IF NOT EXISTS user_permissions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        permission TEXT NOT NULL,
        granted_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP
      );

      -- Audit logs
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        target_type TEXT,
        target_id TEXT,
        details JSONB DEFAULT '{}',
        ip TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Profile views
      CREATE TABLE IF NOT EXISTS profile_views (
        id SERIAL PRIMARY KEY,
        profile_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        viewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Add user_id to projects if missing
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
    `)

    // Seed plans
    const { rows: planRows } = await query('SELECT COUNT(*) FROM plans')
    if (parseInt(planRows[0].count) === 0) {
      for (const p of seedPlans) {
        await query(
          `INSERT INTO plans (name, price, period, description, features, credits, max_projects, max_team_members, storage_mb, can_export, can_share, can_collaborate, active, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [p.name, p.price, p.period, p.description, JSON.stringify(p.features), p.credits, p.maxProjects, p.maxTeamMembers, p.storageMB, p.canExport, p.canShare, p.canCollaborate, p.active, p.sortOrder],
        )
      }
    }

    // Seed testimonials
    const { rows: tRows } = await query('SELECT COUNT(*) FROM testimonials')
    if (parseInt(tRows[0].count) === 0) {
      for (const t of seedTestimonials) {
        await query('INSERT INTO testimonials (text, name, role) VALUES ($1, $2, $3)', [
          t.text, t.name, t.role,
        ])
      }
    }

    // Seed community projects
    const { rows: cRows } = await query('SELECT COUNT(*) FROM community_projects')
    if (parseInt(cRows[0].count) === 0) {
      for (const p of seedCommunity) {
        await query('INSERT INTO community_projects (title, gradient, emoji_hint) VALUES ($1, $2, $3)', [
          p.title, p.gradient, p.emojiHint,
        ])
      }
    }

    global.__dbInitialized = true
  } catch (e) {
    console.error('DB init failed:', e)
  }
}
