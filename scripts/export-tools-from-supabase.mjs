/* eslint-env node */
/*
Interactive exporter: pulls tools from Supabase and appends any missing ids to data/toolsRegistry.json

Usage:
  - Run `npm run pull:tools` which runs this script.
  - If SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are present in the environment, the script will use them.
  - Otherwise the script will prompt you to enter SUPABASE_URL and the service role key interactively.

Note: Running non-interactively is supported by exporting the two env vars before running the script.
*/
// End of header
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import readline from 'readline'

async function promptCredentials() {
  const envUrl = process.env.SUPABASE_URL
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (envUrl && envKey) return { url: envUrl, key: envKey }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const question = (q) => new Promise((res) => rl.question(q, (ans) => res(ans && ans.trim())))

  const url = envUrl || await question('SUPABASE_URL: ')
  const key = envKey || await question('SUPABASE_SERVICE_ROLE_KEY (service role): ')
  rl.close()

  if (!url || !key) {
    console.error('Supabase URL and service role key are required.')
    process.exit(1)
  }

  return { url, key }
}

async function makeClient() {
  const { url, key } = await promptCredentials()
  return createClient(url, key, { auth: { persistSession: false } })
}

async function main() {
  const supabase = await makeClient()
  const src = path.join(process.cwd(), 'data', 'toolsRegistry.json')
  let current = []
  try {
    const raw = fs.readFileSync(src, 'utf8')
    current = JSON.parse(raw)
  } catch (err) {
    console.warn('No existing registry found, starting from empty')
    current = []
  }

  const existingIds = new Set(current.map((t) => t.id))

  const { data: dbTools, error } = await supabase.from('tools').select('id,title,description,category,href').order('created_at', { ascending: true })
  if (error) {
    console.error('Failed to fetch tools from Supabase:', error.message)
    process.exit(1)
  }

  const toAdd = []
  for (const t of dbTools) {
    if (!t || !t.id) continue
    if (existingIds.has(t.id)) continue
    toAdd.push({ id: t.id, title: t.title || t.id, desc: t.description || null, category: t.category || null, href: t.href || (`/tools/${t.id}`) })
  }

  if (toAdd.length === 0) {
    console.log('No new tools to append. Registry already includes all DB ids.')
    process.exit(0)
  }

  // backup
  const bak = path.join(process.cwd(), 'data', `toolsRegistry.json.bak.${Date.now()}`)
  fs.copyFileSync(src, bak)
  console.log('Backed up registry to', bak)

  const merged = current.concat(toAdd)
  fs.writeFileSync(src, JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log(`Appended ${toAdd.length} tools to registry. New registry length: ${merged.length}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
