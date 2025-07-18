import { defineFontProvider } from 'unifont'

export default defineFontProvider('Poppins', async () => ({
  async resolveFont(family) {
    if (family === 'Poppins') {
      return {
        fonts: [
          {
            src: [{ url: '/fonts/Poppins/Poppins-Light.woff', format: 'woff' }],
            weight: 300,
            style: 'normal',
          },
          {
            src: [
              {
                url: '/fonts/Poppins/Poppins-LightItalic.woff',
                format: 'woff',
              },
            ],
            weight: 300,
            style: 'italic',
          },
          {
            src: [
              { url: '/fonts/Poppins/Poppins-Regular.woff', format: 'woff' },
            ],
            weight: 400,
            style: 'normal',
          },
          {
            src: [
              {
                url: '/fonts/Poppins/Poppins-RegularItalic.woff',
                format: 'woff',
              },
            ],
            weight: 400,
            style: 'italic',
          },
          {
            src: [
              { url: '/fonts/Poppins/Poppins-Medium.woff', format: 'woff' },
            ],
            weight: 500,
            style: 'normal',
          },
          {
            src: [
              {
                url: '/fonts/Poppins/Poppins-MediumItalic.woff',
                format: 'woff',
              },
            ],
            weight: 500,
            style: 'italic',
          },
          {
            src: [
              { url: '/fonts/Poppins/Poppins-SemiBold.woff', format: 'woff' },
            ],
            weight: 600,
            style: 'normal',
          },
          {
            src: [
              {
                url: '/fonts/Poppins/Poppins-SemiBoldItalic.woff',
                format: 'woff',
              },
            ],
            weight: 600,
            style: 'italic',
          },
          {
            src: [{ url: '/fonts/Poppins/Poppins-Bold.woff', format: 'woff' }],
            weight: 700,
            style: 'normal',
          },
          {
            src: [
              { url: '/fonts/Poppins/Poppins-BoldItalic.woff', format: 'woff' },
            ],
            weight: 700,
            style: 'italic',
          },
          {
            src: [
              { url: '/fonts/Poppins/Poppins-ExtraBold.woff', format: 'woff' },
            ],
            weight: 800,
            style: 'normal',
          },
          {
            src: [
              {
                url: '/fonts/Poppins/Poppins-ExtraBoldItalic.woff',
                format: 'woff',
              },
            ],
            weight: 800,
            style: 'italic',
          },
          {
            src: [{ url: '/fonts/Poppins/Poppins-Black.woff', format: 'woff' }],
            weight: 900,
            style: 'normal',
          },
          {
            src: [
              {
                url: '/fonts/Poppins/Poppins-BlackItalic.woff',
                format: 'woff',
              },
            ],
            weight: 900,
            style: 'italic',
          },
        ],
      }
    }
  },
}))
