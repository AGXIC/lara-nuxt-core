import { Command } from 'commander'
import { writeFileSync } from 'fs'
import fs from 'fs'
import fetch from 'node-fetch'
import { dirname, resolve } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'

// برای __dirname در ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()

program
  .name('fetch-model-types')
  .description('Fetch Laravel model types and save as TypeScript definitions')
  .requiredOption('-t, --token <token>', 'Authorization token')
  .option(
    '-u, --url <url>',
    'API URL',
    `${process.env.LARAVEL_URL || 'http://localhost:8000'}/api/get-model-types`,
  )
  .option('-o, --output <path>', 'Output file', 'types/models.d.ts')
  .parse(process.argv)

const options = program.opts()

async function main() {
  try {
    console.log('Fetching model types from:', options.url)

    const data = await fetch(options.url, {
      headers: {
        Authorization: `Bearer ${options.token}`,
        Accept: 'text/plain',
      },
    })

    const filePath = resolve(process.cwd(), options.output)

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
    }

    writeFileSync(filePath, data)
    console.log('✅ Model types saved to', filePath)
  } catch (err) {
    console.error('❌ Failed to fetch model types:', err)
    process.exit(1)
  }
}

main()
