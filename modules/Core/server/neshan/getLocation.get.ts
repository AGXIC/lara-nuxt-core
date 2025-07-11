import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const address = query.address

  const runtime = useRuntimeConfig()

  const t = await useTranslation(event)

  if (!address) {
    throw createError({
      statusCode: 400,
      statusMessage: t('Address is required'),
    })
  }

  try {
    const location = await $fetch(`https://api.neshan.org/v4/geocoding`, {
      method: 'GET',
      query: { address },
      headers: {
        'Api-Key': runtime.public.mapApiKey || '',
      },
    })

    return location
  } catch (err: any) {
    throw createError({
      statusCode: 404,
      statusMessage: t('Location not found'),
    })
  }
})
