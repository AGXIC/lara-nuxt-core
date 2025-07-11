<script lang="ts" setup>
  const { isOnline, isVpn } = useNetworkStatus()

  const doNotShowAgain = useLocalStorage('doNotShowVpnOn', false)

  const stats = reactive<{
    severity: string
    summary: string
    closable: boolean
    life?: number
  }>({
    severity: 'success',
    summary: '',
    closable: false,
    life: undefined,
  })

  watch(
    () => [isVpn.value, isOnline.value],
    ([vpn, online], [_, oldOnline]) => {
      if (!online) {
        stats.closable = false
        stats.severity = 'danger'
        stats.summary = t('not-online')
        stats.life = undefined
      } else if (oldOnline && oldOnline !== online) {
        stats.closable = false
        stats.severity = 'success'
        stats.summary = t('online')
        stats.life = 3000
      }

      if (doNotShowAgain.value && vpn && online) {
        stats.closable = true
        stats.severity = 'warn'
        stats.summary = t('use-vpn')
        stats.life = undefined
      }
    },
  )
</script>

<template>
  <Toast
    :message="stats"
    @close="isVpn ? (doNotShowAgain = true) : undefined"
    group="networkStats"
    position="bottom-center"
  ></Toast>
</template>

<style lang="scss" scoped></style>
