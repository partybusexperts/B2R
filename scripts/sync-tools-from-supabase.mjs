/* eslint-env node */
import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { createClient } from '@supabase/supabase-js'

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

async function main() {
  const { url, key } = await promptCredentials()
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const src = path.join(process.cwd(), 'data', 'toolsRegistry.json')
  let current = []
  try {
    const raw = fs.readFileSync(src, 'utf8')
    current = JSON.parse(raw)
  } catch {
    current = []
  }

  const { data: rows, error } = await supabase.from('tools').select('id,title,description,category,href,modal_size,modalSize').order('id', { ascending: true })
  if (error) {
    console.error('Failed to fetch tools from Supabase:', error.message)
    process.exit(1)
  }

  const mapped = (rows || []).map((r) => ({
    id: String(r.id),
    title: r.title || String(r.id),
    desc: r.description || null,
    category: r.category || null,
    href: r.href || (`/tools/${r.id}`),
    modalSize: (r.modalSize || r.modal_size) ?? null,
  }))

  // backup
  const bak = path.join(process.cwd(), 'data', `toolsRegistry.json.bak.${Date.now()}`)
  try {
    fs.copyFileSync(src, bak)
    console.log('Backed up registry to', bak)
  } catch (e) {
    console.log('No existing registry to back up; continuing')
  }

  fs.writeFileSync(src, JSON.stringify(mapped, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${mapped.length} tools to ${src}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
