import { Pool } from 'pg'
import { testimonials as seedTestimonials, communityProjects as seedCommunity } from '@/lib/data'

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

    const { rows: tRows } = await query('SELECT COUNT(*) FROM testimonials')
    if (parseInt(tRows[0].count) === 0) {
      for (const t of seedTestimonials) {
        await query('INSERT INTO testimonials (text, name, role) VALUES ($1, $2, $3)', [
          t.text,
          t.name,
          t.role,
        ])
      }
    }

    const { rows: cRows } = await query('SELECT COUNT(*) FROM community_projects')
    if (parseInt(cRows[0].count) === 0) {
      for (const p of seedCommunity) {
        await query(
          'INSERT INTO community_projects (title, gradient, emoji_hint) VALUES ($1, $2, $3)',
          [p.title, p.gradient, p.emojiHint],
        )
      }
    }

    global.__dbInitialized = true
  } catch (e) {
    console.error('DB init failed:', e)
  }
}
