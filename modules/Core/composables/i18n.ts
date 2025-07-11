export function t(key: string, args?: any | string | number): string {
  const { $i18n }: any = useNuxtApp()
  return $i18n.t(key, args)
}

export function d(
  date?: Date | string,
  type?: 'date' | 'time' | 'long' | 'year',
): string {
  const { $i18n }: any = useNuxtApp()
  return date
    ? '\u200E' + $i18n.d(new Date(date), type || 'long').replace(',', '')
    : '—'
}

export function toCurrency(num: number, key?: string): string {
  const { $i18n }: any = useNuxtApp()
  return $i18n.n(!isNaN(num) ? num : 0, key)
}
