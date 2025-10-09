import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  css: [
    '~/assets/css/main.css',
    '~/assets/css/toman.css',
    '~/assets/css/transitions.css',
  ],
  modules: [
    './modules/Core',
    './modules/Themes',
    './modules/Cms',
    './modules/Tickets',
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
  imports: {
    imports: [{ name: 'twMerge', from: 'tailwind-merge' }],
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
    importTheme: { from: '~/providers/theme.ts' },
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
    plugins: [tailwindcss()],
    resolve: {
      mainFields: ['browser', 'module', 'main', 'jsnext:main', 'jsnext'],
    },
    ssr: {
      noExternal: ['@chenfengyuan/vue-countdown', 'vue-countup-v3'],
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'fa',
    locales: [
      {
        code: 'fa',
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
      preload: true,
    },
    vueI18n: './i18n.config.ts',
  },
  fonts: {
    providers: {
      IranSans: '~/providers/iransans',
      digikala: '~/providers/digikala',
      Poppins: '~/providers/poppins',
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
      {
        name: 'Poppins',
        preload: true,
        global: true,
        provider: 'Poppins',
        weights: [300, 400, 500, 700, 900],
      },
    ],
    processCSSVariables: true,
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
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1600,
    },
  },
  icon: {
    mode: 'css',
    serverBundle: {
      collections: ['ph', 'fluent', 'mingcute', 'tabler'],
    },
    cssLayer: 'base',
  },
  delayHydration: {
    mode: 'mount',
    include: ['/', '/about-us', '/contact-us'],
    exclude: ['**/panel/**'],
  },
  nitro: {
    compressPublicAssets: {
      brotli: true,
    },
    minify: true,
    routeRules: {
      '/**': {
        headers: {
          // HSTS
          'Strict-Transport-Security':
            'max-age=31536000; includeSubDomains; preload',

          // Clickjacking
          'X-Frame-Options': 'DENY',

          // CSP
          'Content-Security-Policy': `
            frame-ancestors 'none';
            base-uri 'self';
          `
            .replace(/\s{2,}/g, ' ')
            .trim(),
        },
      },
    },
  },
  $development: {
    fonts: {
      devtools: true,
    },
    delayHydration: {
      debug: true,
    },
  },
  $production: {
    app: {
      head: {
        script: [
          {
            src: 'https://instant.page/5.2.0',
            type: 'module',
            integrity:
              'sha384-jnZyxPjiipYXnSU0ygqeac2q7CVYMbh84q0uHVRRxEtvFPiQYbXWUorga2aqZJ0z',
            tagPosition: 'bodyOpen',
          },
        ],
      },
    },
    postcss: {
      plugins: {
        cssnano: {
          preset: ['default', { minifyFontValues: { removeQuotes: false } }],
        },
      },
    },
    nitro: {
      routeRules: {
        '/_nuxt/**': {
          headers: {
            'cache-control': `public,max-age=900,s-maxage=900,immutable`,
          },
        },
        '/temp/**': {
          headers: {
            'cache-control': `public,max-age=31536000,s-maxage=31536000,immutable`,
          },
        },
        '/fonts/**': {
          headers: {
            'cache-control': `public,max-age=31536000,s-maxage=31536000,immutable`,
          },
        },
      },
    },
  },
})
