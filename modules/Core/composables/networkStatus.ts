export const useNetworkStatus = createGlobalState(() => {
  const isOnline = useOnline()

  const isVpn = ref(false)

  onMounted(() => {
    $fetch<{ ip: string; country: string }>('https://api.country.is/').then(
      (res) => {
        isVpn.value = res.country !== 'IR'
      },
    )
  })

  return { isOnline, isVpn }
})
