import type { DataTableSortMeta } from 'primevue/datatable'
import qs from 'qs'

export interface IColumnsItem {
  label: string
  key: string
  style?: string | Object
  sortable?: boolean
}

export interface IBulkEmit {
  actions: any
  items: number[]
}

export function useCrudDataTable<T extends IModel>(
  crudId: string,
  apiURL: string,
  relations?: string[],
) {
  const filters = ref({})
  const paginationOptions = reactive<{
    page: number
    perPage: number
    sortItems?: DataTableSortMeta[]
  }>({
    page: 1,
    perPage: 20,
    sortItems: undefined,
  })
  const activeUrl = ref<string>('')

  const initActiveUrl = () =>
    (activeUrl.value = apiURL.concat(
      qs.stringify(
        {
          include: relations?.join(','),
          page: paginationOptions.page,
          per_page: paginationOptions.perPage,
          filter: toRaw(filters.value) || {},
          sort: paginationOptions.sortItems
            ?.map(
              ({ field, order }) => `${order && order < 1 ? '-' : ''}${field}`,
            )
            .join(','),
        },
        {
          arrayFormat: 'brackets',
          skipNulls: true,
          encode: false,
        },
      ),
    ))

  watch(
    () => paginationOptions,
    () => {
      initActiveUrl()
    },
    { immediate: true },
  )

  const { data, status, refresh, execute } = useLazyAsyncData<TPageProps<T>>(
    `crud-${crudId}`,
    () => useSanctumFetch(activeUrl.value),
    {
      watch: [activeUrl],
    },
  )

  const loading = computed(() => status.value === 'pending')

  function fetchData() {
    initActiveUrl()
    execute()
  }

  const removeItems = (ids: number | number[]) => {
    _remove(data.value?.data || [], ({ id: itemId }) =>
      _isArray(ids) ? _includes(ids, itemId || 0) : itemId === ids,
    )
  }

  function onDelete(id: number | number[]) {
    return new Promise<T>((resolve, reject) => {
      useSanctumFetch(apiURL.concat(`/${id.toString()}`), {
        method: 'DELETE',
      })
        .then((res) => {
          removeItems(id)
          resolve(res.msg)
        })
        .catch((err) => reject(err))
    })
  }

  function onRestore(id: number | number[]) {
    return new Promise<T>((resolve, reject) => {
      useSanctumFetch(`${apiURL}/restore/${id.toString()}`)
        .then((res) => {
          removeItems(id)
          resolve(res)
        })
        .catch((err) => reject(err))
    })
  }

  function onDuplicate(id: number) {
    return new Promise<T>((resolve, reject) => {
      useSanctumFetch(`${apiURL}/dup/${id}`)
        .then((res) => {
          data.value?.data.unshift(res.item)
          resolve(res)
        })
        .catch((err) => reject(err))
    })
  }

  function onBulk(args: IBulkEmit) {
    useSanctumFetch(`${apiURL}/bulk`, {
      method: 'POST',
      body: { items: args.items, ...args.actions },
    }).then(() => refresh())
  }

  return {
    data,
    filters,
    activeUrl,
    loading,
    paginationOptions,
    onDelete,
    onRestore,
    onDuplicate,
    onBulk,
    refresh,
    fetchData,
  }
}
