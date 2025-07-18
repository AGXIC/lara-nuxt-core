import { resolve } from 'node:path'
import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  defineNuxtModule,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'Core',
    version: '1.0',
    configKey: 'agxicCore',
  },
  setup(resolvedOptions, nuxt) {
    nuxt.hook('components:dirs', (app) => {
      app.push({ path: `${__dirname}/components` })
    })

    addImportsDir([
      resolve(__dirname, './composables'),
      resolve(__dirname, './stores'),
    ])

    addPlugin({
      src: resolve(__dirname, './plugins/initStore.ts'),
      mode: 'all',
    })

    addComponentsDir({
      path: resolve(__dirname, './components/Crud'),
      enabled: true,
      global: true,
      pathPrefix: true,
    })

    addServerHandler({
      route: '/neshan/getLocationAddress',
      handler: resolve(__dirname, './server/neshan/getLocationAddress.get.ts'),
      lazy: true,
      method: 'get',
    })

    addServerHandler({
      route: '/neshan/getLocation',
      handler: resolve(__dirname, './server/neshan/getLocation.get.ts'),
      lazy: true,
      method: 'get',
    })
  },
  defaults: {
    panelName: 'admin',
  },
})
