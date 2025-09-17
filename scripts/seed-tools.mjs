/* eslint-env node */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const env = process.env
const SUPABASE_URL = env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run') || argv.includes('-n')
// By default skip inserting rows that already exist in the DB. Pass --no-skip-existing to override.
const skipExisting = !argv.includes('--no-skip-existing')
const SUPABASE_SITE_ID = env.SUPABASE_SITE_ID || null

let supabase = null
if (!dryRun) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment (or use --dry-run)')
    process.exit(1)
  }

  // Node may not have global fetch depending on version; polyfill with undici if needed
  if (typeof fetch === 'undefined') {
    try {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const { fetch: undiciFetch, Headers, Request, Response } = await import('undici')
      global.fetch = undiciFetch
      global.Headers = Headers
      global.Request = Request
      global.Response = Response
    } catch (err) {
      console.error('Failed to polyfill fetch with undici:', err.message)
      process.exit(1)
    }
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })
}

const ToolSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  href: z.string().optional(),
  modalSize: z.string().optional(),
})

async function main() {
  const src = path.join(process.cwd(), 'data', 'toolsRegistry.json')
  let raw
  try {
    raw = fs.readFileSync(src, 'utf8')
  } catch (err) {
    console.error('Failed to read data/toolsRegistry.json:', err.message)
    process.exit(1)
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    console.error('Invalid JSON in data/toolsRegistry.json:', err.message)
    process.exit(1)
  }

  if (!Array.isArray(parsed)) {
    console.error('Expected an array in data/toolsRegistry.json')
    process.exit(1)
  }

  const rows = []
  for (const item of parsed) {
    const res = ToolSchema.safeParse(item)
    if (!res.success) {
      console.warn('Skipping invalid tool entry:', res.error.format())
      continue
    }
    const t = res.data
    const row = {
      id: t.id,
      title: t.title,
      description: t.desc || t.description || null,
      category: t.category || null,
      href: t.href || null,
      version: 1,
      compute_kind: 'client',
      inputs_schema: null,
      is_featured: false,
    }
    if (SUPABASE_SITE_ID) row.site_id = SUPABASE_SITE_ID
    rows.push(row)
  }

  if (rows.length === 0) {
    console.log('No valid tool rows to upsert')
    process.exit(0)
  }

  // Remove duplicate ids inside the registry file itself (keep first occurrence)
  const deduped = []
  const seenIds = new Set()
  let duplicateCount = 0
  for (const r of rows) {
    if (seenIds.has(r.id)) {
      duplicateCount += 1
      continue
    }
    seenIds.add(r.id)
    deduped.push(r)
  }
  if (duplicateCount > 0) console.log(`Removed ${duplicateCount} duplicate entries from registry (by id)`)
  rows.length = 0
  rows.push(...deduped)

  console.log(`Prepared ${rows.length} valid tool rows`)

  // If requested, query Supabase for existing ids and filter them out so we only insert missing rows
  if (skipExisting && !dryRun && supabase) {
    try {
      const { data: existingRows, error: existingErr } = await supabase.from('tools').select('id')
      if (existingErr) {
        console.warn('Could not fetch existing tool ids from DB, proceeding to upsert all prepared rows:', existingErr.message)
      } else if (Array.isArray(existingRows)) {
        const existingIds = new Set(existingRows.map((r) => r.id))
        const before = rows.length
        const filtered = rows.filter((r) => !existingIds.has(r.id))
        const removed = before - filtered.length
        if (removed > 0) console.log(`Skipping ${removed} tools already present in DB`)
        rows.length = 0
        rows.push(...filtered)
      }
    } catch (err) {
      console.warn('Error while fetching existing tool ids, proceeding to upsert all prepared rows:', err?.message || err)
    }
  }

  // Upsert in batches of 50 to avoid giant payloads
  const batchSize = 50
  let total = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    if (dryRun) {
      console.log(`DRY-RUN: would upsert batch ${i / batchSize + 1}: ${batch.length} tools`)
      // print ids for quick inspect
      console.log(batch.map((r) => r.id).join(', '))
      total += batch.length
      continue
    }

    let batchCount = 0
    try {
      const { data, error } = await supabase.from('tools').upsert(batch, { onConflict: 'id' }).select('id')
      if (error) {
        // If site_id column doesn't exist in the schema cache, retry without site_id
        if (error.message && error.message.match(/Could not find the 'site_id' column/)) {
          console.warn("Schema mismatch: 'site_id' not present. Retrying upsert without site_id field.")
          const stripped = batch.map(({ site_id, ...rest }) => rest)
          const { data: d2, error: e2 } = await supabase.from('tools').upsert(stripped, { onConflict: 'id' }).select('id')
          if (e2) {
            console.error('Retry upsert failed:', e2.message)
            process.exit(1)
          }
          batchCount = (d2 && d2.length) || batch.length
        } else {
          console.error('Upsert error:', error.message)
          process.exit(1)
        }
      } else {
        batchCount = (data && data.length) || batch.length
      }
    } catch (err) {
      console.error('Upsert error: ', err)
      // If network/fetch failed, include hint
      if (err && err.message && err.message.match(/fetch failed|network error/i)) {
        console.error('Network/fetch failure. Check SUPABASE_URL, network access, and that the service role key is valid.')
      }
      process.exit(1)
    }
    total += batchCount || batch.length
    console.log(`Upserted batch ${i / batchSize + 1}: ${batch.length} tools (result: ${batchCount})`)
  }

  console.log(`Done. Processed ${rows.length} tools. Total upserted (approx): ${total}`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
