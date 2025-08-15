export {}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    agxicTheme?: {
      activeLayout: string
      layoutRoute: string
    }
  }
}
