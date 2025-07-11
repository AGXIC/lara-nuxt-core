import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'
import eslint from 'vite-plugin-eslint2'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,
    vscode: {
      enabled: true,
      reuseExistingServer: true,
    },
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/toman.css',
    '~/assets/css/transitions.css',
  ],
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-svgo',
    '@qirolab/nuxt-sanctum-authentication',
    'nuxt-lodash',
    './modules/Core',
  ],
  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_URL,
      apiUrl: process.env.LARAVEL_URL,
      appName: process.env.NUXT_APP_NAME,
      appEnName: process.env.NUXT_APP_EN_NAME,
      mapApiKey: process.env.NESHAN_WEB_KEY,
      mapServiceKey: process.env.NESHAN_SERVICE_KEY,
      recaptchaSiteKey: process.env.GOOGLE_RECAPTCHA,
    },
  },
  primevue: {
    usePrimeVue: true,
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'system',
        },
      },
      ripple: false,
    },
    directives: {
      include: '*',
      exclude: ['Ripple'],
    },
    components: {
      include: '*',
      exclude: ['FileUpload', 'DatePicker'],
    },
  },
  laravelSanctum: {
    authMode: 'token',
    apiUrl: process.env.LARAVEL_URL,
    middlewareNames: {
      auth: 'sanctum:auth',
      guest: 'sanctum:guest',
    },
    userStateKey: `${process.env.NUXT_APP_EN_NAME}.authenticated.user`,
    redirect: {
      enableIntendedRedirect: true,
    },
  },
  vite: {
    plugins: [tailwindcss(), eslint()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    resolve: {
      mainFields: ['browser', 'module', 'main', 'jsnext:main', 'jsnext'],
    },
  },
  postcss: {
    plugins: {
      cssnano: {
        preset: ['default', { minifyFontValues: { removeQuotes: false } }],
      },
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'fa-IR',
    lazy: true,
    locales: [
      {
        code: 'fa-IR',
        files: [
          { path: './fa/common.json' },
          { path: './fa/errors.json', cache: true },
          { path: './fa/media-library.json', cache: true },
        ],
        flag: 'fa',
        language: 'fa-IR',
        isCatchallLocale: true,
        dir: 'rtl',
      },
    ],
    types: 'composition',
    defaultDirection: 'rtl',
    experimental: {
      typedOptionsAndMessages: 'all',
      autoImportTranslationFunctions: true,
    },
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  fonts: {
    providers: {
      IranSans: '~/providers/iransans',
      digikala: '~/providers/digikala',
    },
    families: [
      {
        name: 'IranSans',
        preload: true,
        global: true,
        provider: 'IranSans',
        weights: [300, 400, 500, 700, 900],
      },
      { name: 'digikala', preload: true, global: true, provider: 'digikala' },
    ],
    processCSSVariables: true,
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  future: {
    typescriptBundlerResolution: true,
  },
  features: {
    inlineStyles: false,
  },
  $development: {
    seo: {
      debug: true,
    },
    experimental: {
      watcher: 'parcel',
    },
    fonts: {
      devtools: true,
    },
  },
  lodash: {
    prefix: '_',
    prefixSkip: ['string'],
    upperAfterPrefix: false,
  },
  svgo: {
    dts: true,
    global: true,
    autoImportPath: './assets/svg',
  },
  image: {
    format: ['webp', 'png', 'jpg', 'jpeg', 'svg'],
    providers: {
      laravel_img: {
        name: 'laravel',
        provider: '~/providers/laravel_img.ts',
      },
    },
    provider: 'ipx',
    ipx: {
      maxAge: 2592000,
    },
  },
  icon: {
    mode: 'css',
    collections: ['ph', 'fluent', 'mingcute', 'tabler'],
    cssLayer: 'base',
  },
})
