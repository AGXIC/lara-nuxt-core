export const useJsonParser = <T = any>(data: string | any): T =>
  typeof data === 'string' && (data.includes('{') || data.includes('['))
    ? JSON.parse(data)
    : data

export const isMounted = () => useMounted().value

export function _omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k as K)),
  ) as Omit<T, K>
}

export function _pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  if (!obj || typeof obj !== 'object') return {} as Pick<T, K>
  if (!Array.isArray(keys)) return {} as Pick<T, K>

  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })

  return result
}

export function _find<T>(
  array: T[],
  predicate:
    | ((item: T, index: number, array: T[]) => boolean)
    | Partial<T>
    | [keyof T, any],
): T | undefined {
  if (!Array.isArray(array)) return undefined

  // ✅ حالت تابعی
  if (typeof predicate === 'function') {
    return array.find(predicate)
  }

  // ✅ حالت آرایه‌ای ['key', value]
  if (Array.isArray(predicate) && predicate.length === 2) {
    const [key, value] = predicate
    return array.find((item) => item?.[key] === value)
  }

  // ✅ حالت شیء { key: value }
  if (typeof predicate === 'object' && predicate !== null) {
    return array.find((item) =>
      Object.entries(predicate).every(
        ([key, value]) => item?.[key as keyof T] === value,
      ),
    )
  }

  return undefined
}

export function _tail<T>(array: T[]): T[] {
  if (!Array.isArray(array)) return []
  return array.slice(1)
}

export function _remove<T>(
  array: T[],
  predicate:
    | ((item: T, index: number, array: T[]) => boolean)
    | Partial<T>
    | [keyof T, any],
): T[] {
  if (!Array.isArray(array)) return []

  const removed: T[] = []

  const isMatch = (item: T): boolean => {
    if (typeof predicate === 'function') {
      return predicate(item, -1, array)
    }

    if (Array.isArray(predicate) && predicate.length === 2) {
      const [key, value] = predicate
      return item?.[key] === value
    }

    if (typeof predicate === 'object' && predicate !== null) {
      return Object.entries(predicate).every(
        ([key, value]) => item?.[key as keyof T] === value,
      )
    }

    return false
  }

  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i]
    if (item !== undefined && isMatch(item)) {
      removed.push(...array.splice(i, 1))
    }
  }

  return removed
}

export function _result<T>(
  obj: T,
  path: string | string[],
  defaultValue?: any,
): any {
  if (!obj)
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue

  const keys = Array.isArray(path) ? path : path.split('.')
  let value: any = obj

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, any>)[key]
    } else {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  }

  return typeof value === 'function' ? value.call(obj) : value
}

export function _differenceBy<T, K>(
  array: T[],
  values: K[],
  iteratee: keyof T | ((item: T | K) => any),
): T[] {
  if (typeof iteratee === 'string') {
    return array.filter(
      (item) =>
        !values.some(
          (val) => (val as any)[iteratee] === (item as any)[iteratee],
        ),
    )
  }

  if (typeof iteratee === 'function') {
    return array.filter(
      (item) => !values.some((val) => iteratee(val) === iteratee(item)),
    )
  }

  // اگر iteratee نداشتیم
  return array.filter((item) => !values.includes(item as any))
}

export function _uniq<T>(arr: T[]): T[] {
  // Set در JS از SameValueZero استفاده می‌کنه (NaN == NaN)
  return [...new Set(arr)]
}

export function _uniqBy<T, K>(
  array: T[],
  key: keyof T | ((item: T) => K),
): T[] {
  const seen = new Set<K | T[keyof T]>()
  return array.filter((item) => {
    const val = typeof key === 'function' ? key(item) : item[key]
    if (seen.has(val)) return false
    seen.add(val)
    return true
  })
}

export function _isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

export function _isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

export function _isEmpty(value: unknown): boolean {
  if (value == null) return true

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

export function _flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, val) => acc.concat(val), [])
}

export function has<T>(obj: T, key: string) {
  if (!obj || _isEmpty(obj)) return false

  return Object.keys(obj).includes(key)
}

export const nv = (key?: any) => (key !== 0 ? key || '—' : key)
