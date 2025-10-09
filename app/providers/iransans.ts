import { defineFontProvider } from 'unifont'

export default defineFontProvider('IranSans', async () => ({
  async resolveFont(family) {
    if (family === 'IranSans') {
      return {
        fonts: [
          {
            src: [
              { url: '/fonts/iransans/300.woff', format: 'woff' },
              { url: '/fonts/iransans/300.woff2', format: 'woff2' },
              { url: '/fonts/iransans/300.eot', format: 'eot' },
              { url: '/fonts/iransans/300.ttf', format: 'ttf' },
            ],
            weight: 300,
            style: 'normal',
          },
          {
            src: [
              { url: '/fonts/iransans/400.woff', format: 'woff' },
              { url: '/fonts/iransans/400.woff2', format: 'woff2' },
              { url: '/fonts/iransans/400.eot', format: 'eot' },
              { url: '/fonts/iransans/400.ttf', format: 'ttf' },
            ],
            weight: 400,
            style: 'normal',
          },
          {
            src: [
              { url: '/fonts/iransans/500.woff', format: 'woff' },
              { url: '/fonts/iransans/500.woff2', format: 'woff2' },
              { url: '/fonts/iransans/500.eot', format: 'eot' },
              { url: '/fonts/iransans/500.ttf', format: 'ttf' },
            ],
            weight: 500,
            style: 'normal',
          },
          {
            src: [
              { url: '/fonts/iransans/700.woff', format: 'woff' },
              { url: '/fonts/iransans/700.woff2', format: 'woff2' },
              { url: '/fonts/iransans/700.eot', format: 'eot' },
              { url: '/fonts/iransans/700.ttf', format: 'ttf' },
            ],
            weight: 700,
            style: 'normal',
          },
          {
            src: [
              { url: '/fonts/iransans/900.woff', format: 'woff' },
              { url: '/fonts/iransans/900.woff2', format: 'woff2' },
              { url: '/fonts/iransans/900.eot', format: 'eot' },
              { url: '/fonts/iransans/900.ttf', format: 'ttf' },
            ],
            weight: 900,
            style: 'normal',
          },
        ],
      }
    }
  },
}))
