// @ts-expect-error
import { createOperationsGenerator } from '#image'
import type { ProviderGetImage } from '@nuxt/image'
import { joinURL } from 'ufo'

const operationsGenerator = createOperationsGenerator()

export const getImage: ProviderGetImage = (
  src,
  { modifiers = { maxAge: 2592000 }, baseURL } = {},
) => {
  if (!baseURL) {
    baseURL = useRuntimeConfig().public.apiUrl
  }

  const operations = operationsGenerator(modifiers)

  return {
    url: joinURL(baseURL, src + (operations ? '?' + operations : '')),
  }
}
