export const useJsonParser = <T = any>(data: string | any): T =>
  typeof data === 'string' && (data.includes('{') || data.includes('['))
    ? JSON.parse(data)
    : data

export const isMounted = () => useMounted().value
