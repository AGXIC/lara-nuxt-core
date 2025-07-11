import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lat = query.lat
  const lng = query.lng

  const runtime = useRuntimeConfig()

  const t = await useTranslation(event)

  if (!lat || !lng) {
    throw createError({
      statusCode: 400,
      statusMessage: t('lat and lng are required'),
    })
  }

  try {
    const location = await $fetch(`https://api.neshan.org/v5/reverse`, {
      method: 'GET',
      query: { lat, lng },
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
