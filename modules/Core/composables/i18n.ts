import { useNuxtApp } from '#app'

export function t(
  key: string,
  args?: Record<string, any> | string | number,
): string {
  const { $i18n } = useNuxtApp()

  if (!$i18n) {
    console.warn('i18n instance not found')
    return key
  }

  try {
    return $i18n.t(key, args)
  } catch (error) {
    console.error('Translation error:', error)
    return key
  }
}

export function d(
  date?: Date | string | null,
  type: 'date' | 'time' | 'long' | 'year' = 'long',
): string {
  const { $i18n } = useNuxtApp()

  if (!date) return '—'

  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return '—'

    const formatted = $i18n?.d?.(dateObj, type) || dateObj.toLocaleString()
    return '\u200E' + formatted.replace(',', '')
  } catch (error) {
    console.error('Date formatting error:', error)
    return '—'
  }
}

export function toCurrency(num: number | string, key = 'currency'): string {
  const { $i18n } = useNuxtApp()

  const number = typeof num === 'string' ? parseFloat(num) : num
  const value = isNaN(number) ? 0 : number

  try {
    return $i18n?.n?.(value, key) || value.toString()
  } catch (error) {
    console.error('Currency formatting error:', error)
    return value.toString()
  }
}
