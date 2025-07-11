import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

export const useValidators = () => {
  const isRequired = (val: any) =>
    _isEmpty(val) || t('Entering this field is required')

  const stringSchema = () =>
    z.string({ required_error: t('Entering this field is required') })

  const iranianMobileNumber = () =>
    stringSchema().regex(/^(09\d{9})$/g, {
      message: t('The entered number is not valid'),
    })

  const isEmail = () =>
    stringSchema().email({
      message: t('The entered email is not valid'),
    })

  const isValidUrl = () =>
    stringSchema().url({ message: t('The entered Url is not valid') })

  const isDateTime = () => z.string().datetime()

  const isDate = () => z.date({ message: t('The entered Date is not valid') })

  const isTime = () =>
    stringSchema().time({ message: t('The entered Time is not valid') })

  const englishOnly = () =>
    stringSchema().regex(/^[a-zA-Z ]+$/g, {
      message: t('Please switch your keyboard to English'),
    })

  const persianOnly = () =>
    stringSchema().regex(/^[\u0600-\u06FF\s]+$/g, {
      message: t('Please switch your keyboard to Persian'),
    })

  const resolver = ref()

  const setResolver = (val: any) => (resolver.value = zodResolver(val))

  return {
    z,
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
