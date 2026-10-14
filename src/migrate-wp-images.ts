import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { MediaService } from './media/media.service.js'
import { PackagesService } from './packages/packages.service.js'

// One-off: copies package photos still hosted on the old WordPress site into this API's own media store
// and points the packages at the new URLs. Safe to re-run: photos that already moved are skipped.
//
// Usage: npm run migrate:wp-images -- <public API URL> [--dry-run]
//   e.g. npm run migrate:wp-images -- https://enjoy-ka-dito-api-production.up.railway.app --dry-run

const WORDPRESS_HOSTS = new Set(['enjoykadito.com', 'www.enjoykadito.com'])

function isWordPressImage(url: string | undefined): url is string {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return WORDPRESS_HOSTS.has(parsed.hostname) && parsed.pathname.startsWith('/wp-content/uploads/')
  } catch {
    return false
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const apiUrl = args.find((arg) => !arg.startsWith('--'))?.replace(/\/$/, '')

  if (!apiUrl) {
    console.error('Usage: npm run migrate:wp-images -- <public API URL> [--dry-run]')
    process.exit(1)
  }

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] })
  const media = app.get(MediaService)
  const packages = app.get(PackagesService)

  // Keeps already-copied URLs the same if the same photo is used twice.
  const copied = new Map<string, string>()

  async function copy(url: string) {
    const existing = copied.get(url)
    if (existing) return existing

    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const buffer = Buffer.from(await response.arrayBuffer())
    const mimetype = response.headers.get('content-type')?.split(';')[0].trim() ?? 'image/jpeg'
    const originalname = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? 'image.jpg')

    const saved = await media.upload({ buffer, mimetype, originalname } as Express.Multer.File)
    const newUrl = `${apiUrl}/media/${saved.id}`
    copied.set(url, newUrl)
    console.log(`    ${url}\n      -> ${newUrl} (${Math.round(saved.size / 1024)} KB, ${saved.width}x${saved.height})`)
    return newUrl
  }

  const all = await packages.findAll({ includeDrafts: true })
  let moved = 0
  let failed = 0

  for (const pkg of all) {
    const needsMain = isWordPressImage(pkg.mainImage)
    const galleryUrls = (pkg.gallery ?? []).filter(isWordPressImage)
    if (!needsMain && galleryUrls.length === 0) continue

    console.log(`${pkg.slug}`)
    if (dryRun) {
      for (const url of [...(needsMain ? [pkg.mainImage!] : []), ...galleryUrls]) console.log(`    would copy ${url}`)
      continue
    }

    try {
      const mainImage = needsMain ? await copy(pkg.mainImage!) : pkg.mainImage
      const gallery: string[] = []
      for (const url of pkg.gallery ?? []) gallery.push(isWordPressImage(url) ? await copy(url) : url)
      await packages.update(pkg.id, { mainImage, gallery })
      moved += 1
    } catch (error) {
      failed += 1
      console.error(`    FAILED: ${error instanceof Error ? error.message : error}`)
    }
  }

  // Give the site's cache refresh (fired by each update) a moment to go out before exiting.
  if (!dryRun) await new Promise((resolve) => setTimeout(resolve, 4000))

  console.log(dryRun ? 'Dry run: nothing was changed.' : `Done. ${moved} package(s) updated, ${failed} failed.`)
  await app.close()
  process.exit(failed > 0 ? 1 : 0)
}

main()
