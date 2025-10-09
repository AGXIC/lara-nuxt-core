import { zodResolver } from '@primevue/forms/resolvers/zod'
import * as z from 'zod'

export const useValidators = () => {
  const isRequired = (val: any) =>
    _isEmpty(val) || t('Entering this field is required')

  const stringSchema = () =>
    z.string({ error: t('Entering this field is required') })

  const iranianMobileNumber = () =>
    stringSchema().regex(/^(09\d{9})$/g, {
      error: t('The entered number is not valid'),
    })

  const isEmail = () =>
    z.email({
      error: t('The entered email is not valid'),
    })

  const isValidUrl = () => z.url({ error: t('The entered Url is not valid') })

  const isDateTime = () => z.iso.datetime()

  const isDate = () => z.date({ error: t('The entered Date is not valid') })

  const isTime = () => z.iso.time({ error: t('The entered Time is not valid') })

  const englishOnly = () =>
    stringSchema().regex(/^[a-zA-Z ]+$/g, {
      error: t('Please switch your keyboard to English'),
    })

  const persianOnly = () =>
    stringSchema().regex(/^[\u0600-\u06FF\s]+$/g, {
      error: t('Please switch your keyboard to Persian'),
    })

  const resolver = ref()

  const setResolver = (val: any) => (resolver.value = zodResolver(val))

  return {
    z,
    stringSchema,
    isRequired,
    iranianMobileNumber,
    isEmail,
    isValidUrl,
    isDateTime,
    isDate,
    isTime,
    englishOnly,
    persianOnly,
    schemaResolver: resolver,
    setSchemaResolver: setResolver,
  }
}
