// Download every mod in src/manifest.json into .cache/mods/<fileID>/, plus
// project metadata into .cache/meta/ (used to regenerate modlist.html).
//
//   node tools/fetch-mods.mjs            # jars + metadata
//   node tools/fetch-mods.mjs --meta     # metadata only
import { loadManifest } from './lib/paths.mjs'
import { downloadFile, getProject, pool } from './lib/curseforge.mjs'

const metaOnly = process.argv.includes('--meta')
const manifest = loadManifest()
let failed = 0

await pool(manifest.files, 6, async f => {
  try {
    const project = await getProject(f.projectID)
    if (!metaOnly) {
      const jar = await downloadFile(f.projectID, f.fileID)
      console.log(`ok   ${project.title} -> ${jar.split(/[\\/]/).pop()}`)
    }
  } catch (e) {
    failed++
    console.error(`FAIL ${f.projectID}/${f.fileID}: ${e.message}`)
  }
})

console.log(`\n${manifest.files.length - failed}/${manifest.files.length} mods ready`)
process.exitCode = failed ? 1 : 0
