// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt().override('nuxt/typescript', {
  plugins: { 'eslint-plugin-prettier/recommended': {} },
  rules: {
    'vue/require-v-for-key': 'error',
  },
})
