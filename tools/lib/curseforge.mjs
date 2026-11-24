// CurseForge access without an API key:
//  - file downloads via the public website endpoint (redirects to the CDN)
//  - project metadata via cfwidget (https://www.cfwidget.com/)
import fs from 'node:fs'
import path from 'node:path'
import { CACHE_DIR } from './paths.mjs'

const UA = { 'User-Agent': 'modpack-build-tools/1.0' }
const META_DIR = path.join(CACHE_DIR, 'meta')
const MODS_DIR = path.join(CACHE_DIR, 'mods')

const sleep = ms => new Promise(r => setTimeout(r, ms))

/** Project metadata from cfwidget, cached on disk. `ref` is a project ID or a "minecraft/mc-mods/<slug>" path. */
export async function getProject(ref, { refresh = false } = {}) {
  const key = String(ref).replace(/[\\/]/g, '_')
  const cacheFile = path.join(META_DIR, `${key}.json`)
  if (!refresh && fs.existsSync(cacheFile)) return JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch(`https://api.cfwidget.com/${ref}`, { headers: UA })
    if (res.status === 200) {
      const json = await res.json()
      fs.mkdirSync(META_DIR, { recursive: true })
      fs.writeFileSync(cacheFile, JSON.stringify(json))
      if (key !== String(json.id)) fs.writeFileSync(path.join(META_DIR, `${json.id}.json`), JSON.stringify(json))
      return json
    }
    // 202 = cfwidget is indexing the project; retry shortly.
    if (res.status !== 202 && res.status < 500) throw new Error(`cfwidget ${ref}: HTTP ${res.status}`)
    await sleep(5000 * attempt)
  }
  throw new Error(`cfwidget ${ref}: gave up after retries`)
}

/** Path of the cached jar for a manifest entry, or null if it has not been downloaded. */
export function cachedJar(fileID) {
  const dir = path.join(MODS_DIR, String(fileID))
  if (!fs.existsSync(dir)) return null
  const jar = fs.readdirSync(dir).find(f => !f.endsWith('.part'))
  return jar ? path.join(dir, jar) : null
}

/** Download a file into .cache/mods/<fileID>/<filename>, returning its path. */
export async function downloadFile(projectID, fileID) {
  const existing = cachedJar(fileID)
  if (existing) return existing
  const url = `https://www.curseforge.com/api/v1/mods/${projectID}/files/${fileID}/download`
  let lastErr
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: UA, redirect: 'follow' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const name = decodeURIComponent(new URL(res.url).pathname.split('/').pop())
      const dir = path.join(MODS_DIR, String(fileID))
      fs.mkdirSync(dir, { recursive: true })
      const tmp = path.join(dir, `${name}.part`)
      fs.writeFileSync(tmp, Buffer.from(await res.arrayBuffer()))
      const out = path.join(dir, name)
      fs.renameSync(tmp, out)
      return out
    } catch (e) {
      lastErr = e
      await sleep(2000 * attempt)
    }
  }
  throw new Error(`download ${projectID}/${fileID} failed: ${lastErr.message}`)
}

/** Run async tasks with limited concurrency. */
export async function pool(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  })
  await Promise.all(workers)
  return results
}
