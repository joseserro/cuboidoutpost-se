// Build the pack's own mods from mods-src/<name>/ into .cache/local-mods/.
//
// Each mods-src/<name>/ holds:
//   mod.json               { id, name, version, jarName, clientOnly, manifest: { <MANIFEST.MF attributes> } }
//   src/main/java/**       Java sources (compiled with `javac --release 8 -proc:none` for Minecraft 1.16.5;
//                          no annotation processing, so mixins must use remap = false)
//   src/main/resources/**  copied into the jar; "${version}" in META-INF/mods.toml is substituted
//   LICENSE                copied into the jar
//
// Compile-time libraries come from the Forge test server's libraries folder when present,
// otherwise they are downloaded from their official Maven repositories into .cache/libs/.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { ZipWriter } from './zip.mjs'
import { CACHE_DIR, ROOT, RUN_DIR } from './paths.mjs'

const MODS_SRC = path.join(ROOT, 'mods-src')
const OUT_DIR = path.join(CACHE_DIR, 'local-mods')
const LIB_DIR = path.join(CACHE_DIR, 'libs')

// Versions shipped with Forge 1.16.5-36.2.26.
const LIBS = [
  { path: 'net/minecraftforge/forge/1.16.5-36.2.26/forge-1.16.5-36.2.26-universal.jar', repo: 'https://maven.minecraftforge.net/' },
  { path: 'org/spongepowered/mixin/0.8.4/mixin-0.8.4.jar', repo: 'https://repo.spongepowered.org/repository/maven-public/' },
  { path: 'org/apache/logging/log4j/log4j-api/2.15.0/log4j-api-2.15.0.jar', repo: 'https://repo1.maven.org/maven2/' },
  { path: 'com/google/code/gson/gson/2.8.7/gson-2.8.7.jar', repo: 'https://repo1.maven.org/maven2/' },
]

async function libJar(lib) {
  const fromServer = path.join(RUN_DIR, 'server', 'libraries', lib.path)
  if (fs.existsSync(fromServer)) return fromServer
  const cached = path.join(LIB_DIR, lib.path)
  if (fs.existsSync(cached)) return cached
  const res = await fetch(lib.repo + lib.path)
  if (!res.ok) throw new Error(`download ${lib.path}: HTTP ${res.status}`)
  fs.mkdirSync(path.dirname(cached), { recursive: true })
  fs.writeFileSync(cached, Buffer.from(await res.arrayBuffer()))
  return cached
}

function findJavac() {
  const exe = process.platform === 'win32' ? 'javac.exe' : 'javac'
  if (process.env.JAVA_HOME) {
    const p = path.join(process.env.JAVA_HOME, 'bin', exe)
    if (fs.existsSync(p)) return p
  }
  return 'javac' // from PATH
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

/** Build every mod under mods-src/. Returns [{ id, jar, clientOnly }]. */
export async function buildLocalMods({ log = console.log } = {}) {
  if (!fs.existsSync(MODS_SRC)) return []
  const classpath = (await Promise.all(LIBS.map(libJar))).join(path.delimiter)
  const javac = findJavac()
  const built = []
  for (const name of fs.readdirSync(MODS_SRC)) {
    const dir = path.join(MODS_SRC, name)
    const metaFile = path.join(dir, 'mod.json')
    if (!fs.existsSync(metaFile)) continue
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'))
    const classes = path.join(CACHE_DIR, 'local-build', name)
    fs.rmSync(classes, { recursive: true, force: true })
    fs.mkdirSync(classes, { recursive: true })

    const sources = walk(path.join(dir, 'src', 'main', 'java')).filter(f => f.endsWith('.java'))
    const argFile = path.join(classes, '..', `${name}.sources.txt`)
    fs.writeFileSync(argFile, sources.map(s => `"${s.replace(/\\/g, '/')}"`).join('\n'))
    try {
      execFileSync(javac, ['--release', '8', '-proc:none', '-encoding', 'UTF-8', '-nowarn', '-Xlint:-options', '-cp', classpath, '-d', classes, `@${argFile}`], { stdio: 'pipe' })
    } catch (e) {
      throw new Error(`javac failed for ${name}:\n${e.stderr || e.message}`)
    }

    const zip = new ZipWriter()
    const manifest = { 'Manifest-Version': '1.0', ...meta.manifest }
    zip.addBuffer('META-INF/MANIFEST.MF', Buffer.from(Object.entries(manifest).map(([k, v]) => `${k}: ${v}`).join('\r\n') + '\r\n\r\n'))
    zip.addDir('', classes)
    const resources = path.join(dir, 'src', 'main', 'resources')
    for (const f of walk(resources)) {
      const rel = path.relative(resources, f).replace(/\\/g, '/')
      let data = fs.readFileSync(f)
      if (rel === 'META-INF/mods.toml') data = Buffer.from(data.toString('utf8').replace(/\$\{version\}/g, meta.version))
      zip.addBuffer(rel, data)
    }
    if (fs.existsSync(path.join(dir, 'LICENSE'))) zip.addFile('LICENSE', path.join(dir, 'LICENSE'))
    const jar = path.join(OUT_DIR, meta.jarName)
    zip.write(jar)
    log(`Built local mod ${meta.id} ${meta.version} -> ${path.relative(ROOT, jar)}`)
    built.push({ id: meta.id, name: meta.name ?? meta.id, dir: name, jar, clientOnly: !!meta.clientOnly })
  }
  return built
}
