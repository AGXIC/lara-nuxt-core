import { resolve } from 'node:path'
import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'Tickets',
    version: '1.0',
    configKey: 'agxicTickets',
  },
  setup(resolvedOptions, nuxt) {
    nuxt.hook('components:dirs', (app) => {
      app.push({ path: `${__dirname}/components` })
    })

    nuxt.hook('pages:extend', (pages) => {
      const adminRouteName =
        nuxt.options.runtimeConfig.public.agxicTheme?.layoutRoute ||
        resolvedOptions.adminRoute

      pages = [
        ...pages,
        {
          file: resolve(__dirname, './pages/admin/tickets.vue'),
          name: `${adminRouteName}-tickets`,
          path: `/${adminRouteName}/tickets`,
          mode: 'client',
        },
      ]
    })
  },
  defaults: {
    adminRoute: 'panel',
  },
})
