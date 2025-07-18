<script lang="ts" setup>
  import { all } from 'primelocale'
  import { Toast, ConfirmDialog } from 'primevue'

  const { localeProperties, defaultDirection, locale } = useI18n()

  useHead({
    htmlAttrs: {
      dir: localeProperties.value.dir || defaultDirection,
    },
  })

  const { logout } = useSanctum()

  const confirm = useConfirm()
  const toast = useNotify()
  const auth = useAuthStore()

  const confirmLogout = () => {
    confirm.require({
      message: t('Do You want to logout from account?'),
      header: t('Logout Account'),
      rejectProps: {
        label: t('Cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: t('Logout'),
        severity: 'danger',
      },
      accept: () => {
        logout(() => {
          toast.add({
            type: 'info',
            msg: t('Logout Success'),
          })
        })
      },
      onHide: () => auth.$patch({ showLogout: false }),
      reject: () => auth.$patch({ showLogout: false }),
    })
  }

  watch(
    () => auth.showLogout,
    (newValue) => {
      if (newValue) confirmLogout()
    },
  )

  const primeVue = usePrimeVue()

  // @ts-expect-error include available langs
  primeVue.config.locale = all[locale.value.substring(0, 2)]
</script>

<template>
  <div>
    <Toast />
    <ConfirmDialog>
      <template #icon>
        <Icon name="ph:shield-warning" size="2rem" />
      </template>
    </ConfirmDialog>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NuxtLoadingIndicator />
  </div>
</template>
