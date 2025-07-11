import { defineStore } from 'pinia'
import qs from 'qs'

interface IFetchOptions {
  page: number
  finished: boolean | false
  collection?: string
  fileTypes?: string[]
  sort: { created_at?: string }
}

export const useFileManagerStore = defineStore('fileManager', () => {
  const fileItems = ref<IMediaItem[]>([])
  const loading = ref(false)
  const search = ref('')
  const fetchOptions = ref<IFetchOptions>({
    page: 1,
    finished: false,
    collection: undefined,
    fileTypes: undefined,
    sort: {},
  })

  const fileDateSortItems = computed(() => [
    { label: t('media-library.asc'), value: 'created_at' },
    { label: t('media-library.desc'), value: '-created_at' },
  ])
  const fileTypeColors = computed(() => [
    { type: 'image', color: 'info' },
    { type: 'video', color: 'danger' },
    { type: 'audio', color: 'warn' },
    { type: 'officedocument', color: 'secondary' },
  ])
  const canLoadMore = computed(
    () => !loading.value && !fetchOptions.value.finished,
  )

  const colorType = (type: string) =>
    fileTypeColors.value.filter(({ type: colorFileType }) =>
      type.includes(colorFileType),
    )?.[0]?.color || 'success'

  function fetchItems(forced?: boolean) {
    loading.value = true
    if (forced) {
      fetchOptions.value.page = 1
      fetchOptions.value.finished = false
      fileItems.value = []
    }
    useSanctumFetch<TPageProps<IMediaItem>>(
      '/api/media-library?' +
        qs.stringify(
          {
            page: fetchOptions.value.page,
            filter: {
              collection: fetchOptions.value.collection,
              type: fetchOptions.value.fileTypes,
            },
            sort: _join(_values(fetchOptions.value.sort), ','),
          },
          {
            arrayFormat: 'brackets',
            skipNulls: true,
            encode: false,
          },
        ),
    )
      .then((res) => {
        fileItems.value = res.data
        fetchOptions.value.finished = res.current_page === res.last_page
        if (!fetchOptions.value.finished) fetchOptions.value.page++
      })
      .finally(() => (loading.value = false))
  }

  watchDebounced(
    search,
    () => {
      fetchItems(true)
    },
    { debounce: 3000, maxWait: 2000 },
  )

  function deleteFile(id: number | number[]) {
    return new Promise((resolve, reject) => {
      useSanctumFetch(`/api/media-library/${id.toString()}`, {
        method: 'DELETE',
      })
        .then((res) => {
          _remove(fileItems.value, ({ id: fileId }) => fileId === id)
          resolve(res.msg)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return {
    // states
    fileItems,
    loading,
    search,
    fetchOptions,
    // getters
    fileTypeColors,
    canLoadMore,
    fileDateSortItems,
    // actions
    colorType,
    fetchItems,
    deleteFile,
  }
})
