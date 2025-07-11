export function useCrudDataFields<T>(crudId: string, apiURL: string) {
  const {
    data,
    status,
    execute: fetchFields,
  } = useLazyAsyncData<TFields<T>>(
    `crud-fields-${crudId}`,
    () => useSanctumFetch(apiURL.concat('/fields')),
    { dedupe: 'defer', immediate: false },
  )

  const loading = computed(() => status.value === 'pending')

  return {
    data,
    loading,
    fetchFields,
  }
}
