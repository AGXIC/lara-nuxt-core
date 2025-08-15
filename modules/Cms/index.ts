import { resolve } from 'node:path'
import { defineNuxtModule } from 'nuxt/kit'

const pageNames = ['faq', 'blogs'] as const
type PageName = (typeof pageNames)[number]
type PageNameOrArray = PageName | PageName[]

export default defineNuxtModule({
  meta: {
    name: 'Cms',
    version: '1.0',
    configKey: 'agxicCms',
  },
  setup(resolvedOptions, nuxt) {
    nuxt.hook('pages:extend', (pages) => {
      const adminRouteName =
        nuxt.options.runtimeConfig.public.agxicTheme?.layoutRoute ||
        resolvedOptions.adminRoute

      if (resolvedOptions.activePages.includes('faq'))
        // faq
        pages = [
          ...pages,
          {
            file: resolve(__dirname, './pages/Faq.vue'),
            name: 'faq',
            path: '/faq',
          },
          // admin
          {
            file: resolve(__dirname, './pages/admin/Faq.vue'),
            name: `${adminRouteName}-faq`,
            path: `/${adminRouteName}/faq`,
          },
        ]
      if (resolvedOptions.activePages.includes('blogs'))
        // blogs
        pages = [
          ...pages,
          {
            file: resolve(__dirname, './pages/Blogs.vue'),
            name: 'blogs',
            path: '/blogs',
          },
          {
            file: resolve(__dirname, './pages/Blog/[slug].vue'),
            name: 'blog',
            path: '/blog/:id',
          },
          // admin
          {
            file: resolve(__dirname, './pages/admin/Blogs.vue'),
            name: `${adminRouteName}-blogs`,
            path: `/${adminRouteName}/blogs`,
          },
        ]
    })
  },
  defaults: {
    activePages: [] as PageNameOrArray,
    adminRoute: 'panel',
  },
})
