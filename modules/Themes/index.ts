import { resolve } from 'node:path'
import { addImportsDir, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'Theme',
    version: '1.0',
    configKey: 'agxicTheme',
  },
  setup(resolvedOptions, nuxt) {
    nuxt.hook('components:dirs', (app) => {
      app.push({ path: `${__dirname}/components` })
    })
    nuxt.hook('app:resolve', (app) => {
      app.layouts = {
        ...app.layouts,
        ...{
          AtlasPanel: {
            file: resolve(__dirname, './layouts/AtlasPanel.vue'),
            name: 'AtlasPanel',
          },
        },
      }
    })
    addImportsDir([resolve(__dirname, './stores')])
  },
})
