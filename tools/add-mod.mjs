// Add (or update) a CurseForge mod in src/manifest.json.
//
//   node tools/add-mod.mjs <slug|projectID> [--file <fileID>] [--client-only]
//
// Without --file, picks the newest file tagged for the pack's Minecraft
// version and loader (Forge). --client-only also records the project in
// tools/pack.json so it is left out of the server pack.
import { MANIFEST, PACK_META, loadManifest, loadPackMeta, writeJson } from './lib/paths.mjs'
import { getProject } from './lib/curseforge.mjs'

const args = process.argv.slice(2)
const ref = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--file')
if (!ref) {
  console.error('usage: node tools/add-mod.mjs <slug|projectID> [--file <fileID>] [--client-only]')
  process.exit(2)
}
const fileArg = args.includes('--file') ? Number(args[args.indexOf('--file') + 1]) : null
const clientOnly = args.includes('--client-only')

const manifest = loadManifest()
const mcVersion = manifest.minecraft.version
const project = await getProject(/^\d+$/.test(ref) ? ref : `minecraft/mc-mods/${ref}`, { refresh: true })

let file
if (fileArg) {
  file = project.files.find(f => f.id === fileArg) ?? { id: fileArg, name: '(unlisted file)' }
} else {
  file = project.files
    .filter(f => f.versions.includes(mcVersion) && !(f.versions.includes('Fabric') && !f.versions.includes('Forge')))
    .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))[0]
  if (!file) {
    console.error(`${project.title} has no Forge file for Minecraft ${mcVersion}.`)
    process.exit(1)
  }
}

const existing = manifest.files.find(f => f.projectID === project.id)
if (existing) {
  console.log(`Updating ${project.title}: ${existing.fileID} -> ${file.id} (${file.name})`)
  existing.fileID = file.id
} else {
  console.log(`Adding ${project.title} (${project.id}): ${file.id} ${file.name}`)
  manifest.files.push({ projectID: project.id, fileID: file.id, required: true })
}
writeJson(MANIFEST, manifest)

if (clientOnly) {
  const meta = loadPackMeta()
  if (!meta.clientOnly.some(c => c.projectID === project.id)) {
    meta.clientOnly.push({ projectID: project.id, name: project.title })
    writeJson(PACK_META, meta)
  }
  console.log('Marked as client-only (left out of the server pack).')
}
