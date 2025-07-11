export function downloadFile(id: number) {
  useSanctumFetch<string>(`/media-library/download/${id}`).then((res) => {
    if (typeof res === 'string' && typeof window !== 'undefined')
      window.open(res, '_blank')
  })
}
