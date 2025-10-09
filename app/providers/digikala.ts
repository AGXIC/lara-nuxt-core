import { defineFontProvider } from 'unifont'

export default defineFontProvider('digikala', async () => ({
  async resolveFont(family) {
    if (family === 'digikala')
      return {
        fonts: [
          {
            src: [
              { url: '/fonts/toman/Digikala.woff', format: 'woff' },
              { url: '/fonts/toman/Digikala.woff2', format: 'woff2' },
              { url: '/fonts/toman/Digikala.ttf', format: 'ttf' },
              { url: '/fonts/toman/Digikala.eot', format: 'eot' },
            ],
          },
        ],
      }
  },
}))
