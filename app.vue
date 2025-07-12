<script lang="ts" setup>
  const { locale } = useI18n()

  useHead({
    htmlAttrs: {
      dir: locale.value.includes('fa') ? 'rtl' : 'ltr',
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
    <NuxtPage />
    <NuxtLoadingIndicator />
  </div>
</template>
