import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
export const SRC = path.join(ROOT, 'src')
export const OVERRIDES = path.join(SRC, 'overrides')
export const SERVER_FILES = path.join(SRC, 'server files')
export const MANIFEST = path.join(SRC, 'manifest.json')
export const CACHE_DIR = path.join(ROOT, '.cache')
export const DIST = path.join(ROOT, 'dist')
export const RUN_DIR = path.join(ROOT, 'run')
export const PACK_META = path.join(ROOT, 'tools', 'pack.json')

export const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, ''))
export const writeJson = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 2) + '\n')

export function loadManifest() {
  return readJson(MANIFEST)
}

/** Pack-level settings that are not part of the CurseForge manifest (client-only mods, etc.). */
export function loadPackMeta() {
  return readJson(PACK_META)
}

export function packSlug(manifest) {
  return `${manifest.name.replace(/[^A-Za-z0-9]+/g, '')}-${manifest.version}`
}
