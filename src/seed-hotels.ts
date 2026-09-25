import 'reflect-metadata'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { HotelsService } from './hotels/hotels.service.js'

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\r') {
      // skip
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

function parseStarRating(text: string): number {
  const t = text.trim().toLowerCase()
  if (!t || t.includes('no star')) return 0
  const match = t.match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

async function main() {
  const csvPath = path.resolve(process.cwd(), '../docs/HOTELS-RESORTS-extracted.csv')
  const text = readFileSync(csvPath, 'utf8')
  const rows = parseCsv(text).filter((r) => r.some((cell) => cell.trim() !== ''))

  const [header, ...dataRows] = rows
  console.log('Columns:', header)

  const seen = new Set<string>()
  const hotels: { name: string; region: string; starRating: number }[] = []

  for (const row of dataRows) {
    const [name, starRatingText, region] = row
    if (!name?.trim() || !region?.trim()) continue

    const key = `${name.trim().toLowerCase()}|${region.trim().toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)

    hotels.push({
      name: name.trim(),
      region: region.trim(),
      starRating: parseStarRating(starRatingText ?? ''),
    })
  }

  console.log(`Parsed ${dataRows.length} rows -> ${hotels.length} unique hotels.`)

  const app = await NestFactory.createApplicationContext(AppModule)
  const hotelsService = app.get(HotelsService)

  const existing = await hotelsService.findAll()
  const existingKeys = new Set(existing.map((h) => `${h.name.trim().toLowerCase()}|${h.region.trim().toLowerCase()}`))

  let created = 0
  let skipped = 0

  for (const hotel of hotels) {
    const key = `${hotel.name.toLowerCase()}|${hotel.region.toLowerCase()}`
    if (existingKeys.has(key)) {
      skipped++
      continue
    }

    await hotelsService.create({
      name: hotel.name,
      region: hotel.region,
      starRating: hotel.starRating,
    })
    created++
  }

  console.log(`Created ${created} hotels, skipped ${skipped} already-existing.`)
  await app.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
