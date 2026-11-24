// Build the pack.
//
//   node tools/build.mjs            # validate, regenerate modlist.html, write both zips
//   node tools/build.mjs --check    # validate only
//   node tools/build.mjs --client   # client (CurseForge) zip only
//
// Outputs (dist/):
//   <Name>-<version>.zip         CurseForge import: manifest.json, modlist.html, overrides/
//   <Name>-<version>-server.zip  server pack: overrides + server files + server-side mods
//                                (mods come from .cache, run `node tools/fetch-mods.mjs` first)
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { ZipWriter } from './lib/zip.mjs'
import { cachedJar, getProject, pool } from './lib/curseforge.mjs'
import { buildLocalMods } from './lib/local-mods.mjs'
import { DIST, MANIFEST, OVERRIDES, ROOT, SERVER_FILES, SRC, loadManifest, loadPackMeta, packSlug, readJson } from './lib/paths.mjs'

const args = new Set(process.argv.slice(2))
const manifest = loadManifest()
const packMeta = loadPackMeta()
const slug = packSlug(manifest)

// ---------------------------------------------------------------- validation
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function validate() {
  const errors = []
  const rel = f => path.relative(SRC, f).replace(/\\/g, '/')

  // manifest sanity
  const seen = new Set()
  for (const f of manifest.files) {
    if (!Number.isInteger(f.projectID) || !Number.isInteger(f.fileID)) errors.push(`manifest: bad entry ${JSON.stringify(f)}`)
    if (seen.has(f.projectID)) errors.push(`manifest: duplicate project ${f.projectID}`)
    seen.add(f.projectID)
  }
  for (const b of packMeta.bundled ?? []) {
    if (!seen.has(b.projectID)) errors.push(`tools/pack.json: bundled mod ${b.projectID} (${b.name}) is not in the manifest`)
    if (!b.licenseFile || !fs.existsSync(path.join(ROOT, b.licenseFile))) errors.push(`tools/pack.json: bundled mod ${b.name} needs an existing licenseFile`)
  }

  const files = walk(OVERRIDES)
  for (const f of files.filter(f => /\.(json|mcmeta)$/i.test(f))) {
    try { readJson(f) } catch (e) { errors.push(`${rel(f)}: invalid JSON (${e.message})`) }
  }
  // KubeJS uses Rhino with ES6 enabled; `node --check` catches syntax errors.
  for (const f of files.filter(f => f.endsWith('.js'))) {
    try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }) } catch (e) {
      errors.push(`${rel(f)}: ${String(e.stderr).split('\n').slice(0, 5).join(' ').trim()}`)
    }
  }

  // Quest translation keys must exist in en_us.
  const langKeys = new Set()
  for (const f of files.filter(f => /kubejs[\\/]assets[\\/][^\\/]+[\\/]lang[\\/]en_us\.json$/.test(f))) {
    Object.keys(readJson(f)).forEach(k => langKeys.add(k))
  }
  const questDir = path.join(OVERRIDES, 'config', 'ftbquests', 'quests')
  const missing = new Set()
  for (const f of walk(questDir).filter(f => f.endsWith('.snbt'))) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/\{(cuboiddroid\.[^}]+)\}/g)) {
      if (!langKeys.has(m[1])) missing.add(m[1])
    }
  }
  for (const k of missing) errors.push(`quests: missing en_us translation for ${k}`)

  return errors
}

const errors = validate()
if (errors.length) {
  console.error(`Validation failed (${errors.length}):\n  ` + errors.join('\n  '))
  process.exit(1)
}
console.log('Validation passed.')
if (args.has('--check')) process.exit(0)

// ---------------------------------------------------------------- local mods
// The pack's own mods (mods-src/) are compiled here (needs a JDK) and shipped as
// overrides/mods/<jar> in the client zip, and in the server zip unless client-only.
const localMods = await buildLocalMods()

// ---------------------------------------------------------------- modlist.html
const projects = await pool(manifest.files, 6, f => getProject(f.projectID).catch(() => null))
const missingMeta = manifest.files.filter((f, i) => !projects[i])
if (missingMeta.length) {
  console.warn(`modlist.html: no metadata for ${missingMeta.map(f => f.projectID).join(', ')} (kept as IDs)`)
}
const items = manifest.files.map((f, i) => {
  const p = projects[i]
  if (!p) return `<li>Project ${f.projectID}</li>`
  const author = p.members?.find(m => /owner|author/i.test(m.title))?.username ?? p.members?.[0]?.username ?? 'unknown'
  const url = p.urls?.curseforge ?? `https://www.curseforge.com/projects/${p.id}`
  return `<li><a href="${url}">${escapeHtml(p.title)} (by ${escapeHtml(author)})</a></li>`
})
for (const m of localMods) items.push(`<li>${escapeHtml(m.name)} (bundled; built from mods-src/${escapeHtml(m.dir)})</li>`)
fs.writeFileSync(path.join(SRC, 'modlist.html'), `<ul>\n${items.join('\n')}\n</ul>\n`)

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ---------------------------------------------------------------- client zip
// Bundled mods (tools/pack.json "bundled"): CurseForge won't distribute them, but their
// licences allow it, so ship the jar + licence in overrides and leave them out of the
// zip's manifest (otherwise the CurseForge app reports them as "blocked mods").
const bundled = new Map((packMeta.bundled ?? []).map(b => [b.projectID, b]))
const clientManifest = { ...manifest, files: manifest.files.filter(f => !bundled.has(f.projectID)) }
const clientZip = new ZipWriter()
clientZip.addBuffer('manifest.json', Buffer.from(JSON.stringify(clientManifest, null, 2) + '\n'))
clientZip.addFile('modlist.html', path.join(SRC, 'modlist.html'))
clientZip.addDir('overrides', OVERRIDES)
for (const m of localMods) clientZip.addFile(`overrides/mods/${path.basename(m.jar)}`, m.jar)
for (const f of manifest.files) {
  const b = bundled.get(f.projectID)
  if (!b) continue
  const jar = cachedJar(f.fileID)
  if (!jar) {
    console.error(`Bundled mod ${b.name} (${f.projectID}/${f.fileID}) not downloaded. Run: node tools/fetch-mods.mjs`)
    process.exit(1)
  }
  const jarName = path.basename(jar)
  clientZip.addFile(`overrides/mods/${jarName}`, jar)
  clientZip.addBuffer(`overrides/${bundledLicence(b, jarName).name}`, bundledLicence(b, jarName).data)
}

function bundledLicence(b, jarName) {
  return {
    name: `licenses/${jarName.replace(/\.jar$/i, '')}-LICENSE.txt`,
    data: Buffer.from(`${b.name} (${jarName}) is bundled under the ${b.license} licence.\nSource: ${b.source}\n\n` + fs.readFileSync(path.join(ROOT, b.licenseFile), 'utf8')),
  }
}
if (bundled.size) console.log(`Bundled ${bundled.size} mod(s) in overrides/mods: ${[...bundled.values()].map(b => b.name).join(', ')}`)
const clientOut = path.join(DIST, `${slug}.zip`)
clientZip.write(clientOut)
console.log(`Wrote ${path.relative(process.cwd(), clientOut)} (${clientZip.entries.length} files)`)

if (args.has('--client')) process.exit(0)

// ---------------------------------------------------------------- server zip
const clientOnly = new Set(packMeta.clientOnly.map(c => c.projectID))
const serverZip = new ZipWriter()
serverZip.addDir('', OVERRIDES)
// server files (start scripts, README, server-only scripts) go on top of overrides
serverZip.addDir('', SERVER_FILES, name => !/\.zip$/i.test(name))
const missingJars = []
for (const f of manifest.files) {
  if (clientOnly.has(f.projectID)) continue
  const jar = cachedJar(f.fileID)
  if (!jar) { missingJars.push(f.projectID); continue }
  serverZip.addFile(`mods/${path.basename(jar)}`, jar)
  const b = bundled.get(f.projectID)
  if (b) {
    const lic = bundledLicence(b, path.basename(jar))
    serverZip.addBuffer(lic.name, lic.data)
  }
}
for (const m of localMods) if (!m.clientOnly) serverZip.addFile(`mods/${path.basename(m.jar)}`, m.jar)
if (missingJars.length) {
  console.error(`Server zip skipped: ${missingJars.length} mods not downloaded. Run: node tools/fetch-mods.mjs`)
  process.exit(1)
}
const serverOut = path.join(DIST, `${slug}-server.zip`)
serverZip.write(serverOut)
console.log(`Wrote ${path.relative(process.cwd(), serverOut)} (${serverZip.entries.length} files, ${manifest.files.length - clientOnly.size} mods)`)
