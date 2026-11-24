// Boot the pack on a local headless Forge server and report script/startup errors.
//
//   node tools/test-server.mjs [--accept-eula] [--fresh] [--keep-running] [--cmd "<console command>"]...
//
//   --accept-eula   write eula=true (the Minecraft EULA, https://aka.ms/MinecraftEULA); needed once
//   --fresh         delete the test world first
//   --keep-running  don't send "stop" after startup (Ctrl+C to quit)
//   --cmd           console command to run after startup, before stopping (repeatable)
//   --load-client-mods  also load the pack's client-only local mods (mods-src/) as a load smoke test
//
// Everything lives in run/server (git-ignored). Java 8 is downloaded to .cache/jre8.
// Mods come from .cache/mods (run `node tools/fetch-mods.mjs` first); client-only
// mods listed in tools/pack.json are left out, exactly as in the server zip.
import fs from 'node:fs'
import path from 'node:path'
import { spawn, execFileSync } from 'node:child_process'
import { CACHE_DIR, ROOT, OVERRIDES, RUN_DIR, SERVER_FILES, loadManifest, loadPackMeta } from './lib/paths.mjs'
import { cachedJar } from './lib/curseforge.mjs'
import { buildLocalMods } from './lib/local-mods.mjs'

const argv = process.argv.slice(2)
const flag = f => argv.includes(f)
const cmds = argv.flatMap((a, i) => (a === '--cmd' ? [argv[i + 1]] : []))

const manifest = loadManifest()
const mc = manifest.minecraft.version
const forgeVersion = manifest.minecraft.modLoaders.find(l => l.primary).id.replace(/^forge-/, '')
const forgeFull = `${mc}-${forgeVersion}`
const SERVER = path.join(RUN_DIR, 'server')
const isWin = process.platform === 'win32'

// ------------------------------------------------------------------ java 8
async function ensureJava() {
  const home = path.join(CACHE_DIR, 'jre8')
  const find = () => {
    if (!fs.existsSync(home)) return null
    for (const d of fs.readdirSync(home)) {
      const exe = path.join(home, d, 'bin', isWin ? 'java.exe' : 'java')
      if (fs.existsSync(exe)) return exe
    }
    return null
  }
  if (find()) return find()
  const os = isWin ? 'windows' : process.platform === 'darwin' ? 'mac' : 'linux'
  const url = `https://api.adoptium.net/v3/binary/latest/8/ga/${os}/x64/jre/hotspot/normal/eclipse`
  console.log(`Downloading Java 8 JRE (${os})...`)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`JRE download failed: HTTP ${res.status}`)
  fs.mkdirSync(home, { recursive: true })
  const archive = path.join(home, isWin ? 'jre.zip' : 'jre.tar.gz')
  fs.writeFileSync(archive, Buffer.from(await res.arrayBuffer()))
  if (isWin) {
    execFileSync('powershell.exe', ['-NoProfile', '-Command', `Expand-Archive -LiteralPath '${archive}' -DestinationPath '${home}' -Force`], { stdio: 'inherit' })
  } else {
    execFileSync('tar', ['-xzf', archive, '-C', home], { stdio: 'inherit' })
  }
  fs.rmSync(archive)
  const exe = find()
  if (!exe) throw new Error('JRE extracted but java executable not found')
  return exe
}

// ------------------------------------------------------------------ forge
async function ensureForge(java) {
  const jar = path.join(SERVER, `forge-${forgeFull}.jar`)
  if (fs.existsSync(jar)) return jar
  fs.mkdirSync(SERVER, { recursive: true })
  const installer = path.join(CACHE_DIR, `forge-${forgeFull}-installer.jar`)
  if (!fs.existsSync(installer)) {
    console.log(`Downloading Forge ${forgeFull} installer...`)
    const res = await fetch(`https://maven.minecraftforge.net/net/minecraftforge/forge/${forgeFull}/forge-${forgeFull}-installer.jar`)
    if (!res.ok) throw new Error(`Forge installer download failed: HTTP ${res.status}`)
    fs.writeFileSync(installer, Buffer.from(await res.arrayBuffer()))
  }
  console.log('Installing Forge server...')
  execFileSync(java, ['-jar', installer, '--installServer', SERVER], { stdio: 'inherit', cwd: SERVER })
  if (!fs.existsSync(jar)) throw new Error(`Forge install did not produce ${jar}`)
  return jar
}

// ------------------------------------------------------------------ pack sync
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true })
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name)
    const d = path.join(dst, ent.name)
    if (ent.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

function syncPack(localMods) {
  // Pack-owned folders are replaced wholesale so removed files don't linger.
  for (const d of ['config', 'defaultconfigs', 'kubejs', 'scripts', 'patchouli_books', 'mods']) {
    fs.rmSync(path.join(SERVER, d), { recursive: true, force: true })
  }
  copyDir(OVERRIDES, SERVER)
  for (const ent of fs.readdirSync(SERVER_FILES, { withFileTypes: true })) {
    if (/\.(zip)$/i.test(ent.name)) continue
    const s = path.join(SERVER_FILES, ent.name)
    if (ent.isDirectory()) copyDir(s, path.join(SERVER, ent.name))
    else fs.copyFileSync(s, path.join(SERVER, ent.name))
  }
  const clientOnly = new Set(loadPackMeta().clientOnly.map(c => c.projectID))
  const modsDir = path.join(SERVER, 'mods')
  fs.mkdirSync(modsDir, { recursive: true })
  let n = 0
  for (const f of manifest.files) {
    if (clientOnly.has(f.projectID)) continue
    const jar = cachedJar(f.fileID)
    if (!jar) throw new Error(`Mod ${f.projectID}/${f.fileID} not downloaded; run node tools/fetch-mods.mjs`)
    fs.copyFileSync(jar, path.join(modsDir, path.basename(jar)))
    n++
  }
  // The pack's own mods (mods-src/): server-side ones always; client-only ones only with
  // --load-client-mods, as a smoke test that Forge accepts the mod file and Mixin parses its
  // config (client mixins are not applied on a dedicated server).
  for (const m of localMods) {
    if (m.clientOnly && !flag('--load-client-mods')) continue
    fs.copyFileSync(m.jar, path.join(modsDir, path.basename(m.jar)))
    console.log(`Added local mod ${m.id}${m.clientOnly ? ' (client-only, load test)' : ''}`)
  }
  // Test-only KubeJS scripts (probes) from tools/test-scripts are layered on top; never shipped.
  const testScripts = path.join(ROOT, 'tools', 'test-scripts')
  if (fs.existsSync(testScripts)) copyDir(testScripts, path.join(SERVER, 'kubejs'))
  console.log(`Synced pack: ${n} CurseForge mods + overrides`)

  const props = path.join(SERVER, 'server.properties')
  const wanted = {
    'level-type': 'skyblockbuilder\\:custom_skyblock',
    'allow-flight': 'true',
    difficulty: '2',
    'max-tick-time': '-1',
    'view-distance': '6',
    'server-port': '25599',
    'enable-query': 'false',
    motd: 'Cuboid Outpost SE test server',
  }
  const lines = fs.existsSync(props) ? fs.readFileSync(props, 'utf8').split(/\r?\n/) : []
  const keys = new Set()
  const out = lines.map(l => {
    const k = l.split('=')[0]
    if (k in wanted) { keys.add(k); return `${k}=${wanted[k]}` }
    return l
  })
  for (const [k, v] of Object.entries(wanted)) if (!keys.has(k)) out.push(`${k}=${v}`)
  fs.writeFileSync(props, out.join('\n'))
}

// ------------------------------------------------------------------ run
function run(java, forgeJar) {
  return new Promise(resolve => {
    const logFile = path.join(SERVER, 'test-run.log')
    const log = fs.createWriteStream(logFile)
    const p = spawn(java, ['-Xms2G', '-Xmx6G', '-jar', path.basename(forgeJar), 'nogui'], { cwd: SERVER })
    let started = false
    let buf = ''
    const timeout = setTimeout(() => {
      console.error('Timed out after 20 minutes; killing server.')
      p.kill()
    }, 20 * 60 * 1000)
    const onData = d => {
      log.write(d)
      buf += d.toString()
      let i
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i)
        buf = buf.slice(i + 1)
        if (/\bERROR\b|Exception|FATAL/.test(line) || /Done \(/.test(line)) console.log(line.trim())
        if (!started && /Done \([\d.]+s\)!/.test(line)) {
          started = true
          for (const c of cmds) p.stdin.write(`${c}\n`)
          if (!flag('--keep-running')) setTimeout(() => p.stdin.write('stop\n'), cmds.length ? 15000 : 2000)
        }
      }
    }
    p.stdout.on('data', onData)
    p.stderr.on('data', onData)
    if (flag('--keep-running')) process.stdin.pipe(p.stdin)
    p.on('exit', code => {
      clearTimeout(timeout)
      log.end()
      resolve({ code, started })
    })
  })
}

function report(started) {
  console.log('\n=============== report ===============')
  console.log(started ? 'Server reached "Done" (started successfully).' : 'Server did NOT finish starting.')
  for (const f of ['startup.txt', 'server.txt']) {
    const p = path.join(SERVER, 'logs', 'kubejs', f)
    if (!fs.existsSync(p)) continue
    const bad = fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(l => /\[(ERR|WARN)\s*\]|Error|error:/.test(l))
    console.log(`kubejs/${f}: ${bad.length} warning/error lines`)
    bad.slice(0, 40).forEach(l => console.log('  ' + l))
  }
  const crashDir = path.join(SERVER, 'crash-reports')
  if (fs.existsSync(crashDir)) {
    const recent = fs.readdirSync(crashDir).map(f => path.join(crashDir, f)).filter(f => fs.statSync(f).mtimeMs > startTime)
    recent.forEach(f => console.log(`CRASH REPORT: ${f}`))
  }
  console.log(`Full log: ${path.join(SERVER, 'test-run.log')}`)
}

const startTime = Date.now()
const java = await ensureJava()
const forgeJar = await ensureForge(java)
const eula = path.join(SERVER, 'eula.txt')
if (flag('--accept-eula')) fs.writeFileSync(eula, 'eula=true\n')
if (!fs.existsSync(eula) || !/eula=true/.test(fs.readFileSync(eula, 'utf8'))) {
  console.error('The Minecraft EULA (https://aka.ms/MinecraftEULA) must be accepted: rerun with --accept-eula')
  process.exit(2)
}
if (flag('--fresh')) fs.rmSync(path.join(SERVER, 'world'), { recursive: true, force: true })
syncPack(await buildLocalMods())
const { code, started } = await run(java, forgeJar)
report(started)
process.exitCode = started && code === 0 ? 0 : 1
