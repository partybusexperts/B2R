import fs from 'fs/promises'
import path from 'path'

export type Tool = {
  id: string
  title: string
  desc?: string
  category?: string
  href?: string
  [k: string]: any
}

export async function findToolById(id: string): Promise<Tool | null> {
  const useLocal = process.env.USE_LOCAL_REGISTRY === 'true' || !process.env.SUPABASE_URL

  const readLocal = async (): Promise<Tool | null> => {
    try {
      const p = path.resolve(process.cwd(), 'data', 'toolsRegistry.json')
      const raw = await fs.readFile(p, 'utf8')
      const arr: Tool[] = JSON.parse(raw)
      return arr.find((t) => t.id === id) ?? null
    } catch (e) {
      return null
    }
  }

  if (useLocal) return readLocal()

  try {
    const mod = await import(path.resolve(process.cwd(), 'src', 'lib', 'getTools'))
    const getTools = (mod as any).getTools ?? (mod as any).default
    if (typeof getTools === 'function') {
      const tools = await getTools()
      return (tools as Tool[]).find((t) => t.id === id) ?? null
    }
  } catch (e) {
    // fallback to local
  }

  return readLocal()
}
