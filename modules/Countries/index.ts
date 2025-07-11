import { resolve } from 'node:path'
import { addImportsDir, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'Countries',
    version: '1.0',
  },
  setup(resolvedOptions, nuxt) {
    nuxt.hook('components:dirs', (app) => {
      app.push({ path: `${__dirname}/components` })
    })

    addImportsDir([resolve(__dirname, './composables')])
  },
})
