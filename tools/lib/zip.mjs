// Minimal, dependency-free ZIP writer (deflate, forward-slash entry names).
// Needs Node 22.2+ for zlib.crc32.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

export class ZipWriter {
  constructor() {
    this.entries = []
  }

  /** Add a file from a Buffer under the given archive path. */
  addBuffer(name, data, mtime = new Date()) {
    name = name.replace(/\\/g, '/').replace(/^\/+/, '')
    if (this.entries.some(e => e.name === name)) throw new Error(`Duplicate zip entry: ${name}`)
    // Jars and PNGs are already compressed; store them as is.
    const store = /\.(jar|zip|png|ogg|nbt)$/i.test(name)
    const compressed = store ? data : zlib.deflateRawSync(data, { level: 9 })
    this.entries.push({ name, data: compressed, method: store ? 0 : 8, crc: zlib.crc32(data), size: data.length, mtime })
  }

  addFile(name, file) {
    const stat = fs.statSync(file)
    this.addBuffer(name, fs.readFileSync(file), stat.mtime)
  }

  /** Recursively add a directory's files under the prefix. */
  addDir(prefix, dir, filter = () => true) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name)
      const name = prefix ? `${prefix}/${ent.name}` : ent.name
      if (ent.isDirectory()) this.addDir(name, full, filter)
      else if (filter(name, full)) this.addFile(name, full)
    }
  }

  has(name) {
    return this.entries.some(e => e.name === name)
  }

  write(outFile) {
    const chunks = []
    const central = []
    let offset = 0
    for (const e of this.entries) {
      const nameBuf = Buffer.from(e.name, 'utf8')
      const { time, date } = dosTime(e.mtime)
      const local = Buffer.alloc(30)
      local.writeUInt32LE(0x04034b50, 0)
      local.writeUInt16LE(20, 4) // version needed
      local.writeUInt16LE(0x0800, 6) // UTF-8 names
      local.writeUInt16LE(e.method, 8)
      local.writeUInt16LE(time, 10)
      local.writeUInt16LE(date, 12)
      local.writeUInt32LE(e.crc, 14)
      local.writeUInt32LE(e.data.length, 18)
      local.writeUInt32LE(e.size, 22)
      local.writeUInt16LE(nameBuf.length, 26)
      local.writeUInt16LE(0, 28)
      chunks.push(local, nameBuf, e.data)

      const cen = Buffer.alloc(46)
      cen.writeUInt32LE(0x02014b50, 0)
      cen.writeUInt16LE(20, 4)
      cen.writeUInt16LE(20, 6)
      cen.writeUInt16LE(0x0800, 8)
      cen.writeUInt16LE(e.method, 10)
      cen.writeUInt16LE(time, 12)
      cen.writeUInt16LE(date, 14)
      cen.writeUInt32LE(e.crc, 16)
      cen.writeUInt32LE(e.data.length, 20)
      cen.writeUInt32LE(e.size, 24)
      cen.writeUInt16LE(nameBuf.length, 28)
      cen.writeUInt32LE(offset, 42)
      central.push(cen, nameBuf)
      offset += 30 + nameBuf.length + e.data.length
      if (offset > 0xffffffff) throw new Error('Archive exceeds 4 GiB (ZIP64 not supported)')
    }
    const cenSize = central.reduce((n, b) => n + b.length, 0)
    const end = Buffer.alloc(22)
    end.writeUInt32LE(0x06054b50, 0)
    end.writeUInt16LE(this.entries.length, 8)
    end.writeUInt16LE(this.entries.length, 10)
    end.writeUInt32LE(cenSize, 12)
    end.writeUInt32LE(offset, 16)
    fs.mkdirSync(path.dirname(outFile), { recursive: true })
    fs.writeFileSync(outFile, Buffer.concat([...chunks, ...central, end]))
  }
}

function dosTime(d) {
  const year = Math.max(1980, d.getFullYear())
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((year - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  }
}
