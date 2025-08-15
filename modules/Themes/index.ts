import { resolve } from 'node:path'
import { addImportsDir, addRouteMiddleware, defineNuxtModule } from 'nuxt/kit'

type ILayout = 'AtlasPanel'

export default defineNuxtModule({
  meta: {
    name: 'Theme',
    version: '1.0',
    configKey: 'agxicTheme',
  },
  setup(resolvedOptions, nuxt) {
    addRouteMiddleware([
      {
        name: 'pageAccess',
        path: resolve(__dirname, './middlewares/pageAccess.ts'),
      },
    ])

    nuxt.hook('components:dirs', (app) => {
      app.push({ path: `${__dirname}/components` })
    })

    nuxt.hook('app:resolve', (app) => {
      app.layouts = {
        ...app.layouts,
        [resolvedOptions.activeLayout]: {
          file: resolve(
            __dirname,
            `./layouts/${resolvedOptions.activeLayout}.vue`,
          ),
          name: resolvedOptions.activeLayout,
        },
      }
    })

    addImportsDir([resolve(__dirname, './stores')])
  },
  defaults: {
    activeLayout: 'AtlasPanel' as ILayout,
    layoutRoute: 'panel',
  },
})
