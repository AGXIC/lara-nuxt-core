import { useAuthStore } from '../stores/authStore'
import { useCoreStore } from '../stores/coreStore'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin(async ({ $pinia, vueApp }) => {
  const coreStore = useCoreStore($pinia as Pinia)
  const authStore = useAuthStore($pinia as Pinia)

  vueApp.config.globalProperties.$coreStore = coreStore
  vueApp.config.globalProperties.$authStore = authStore

  await coreStore.fetchConfigs()
  await authStore.fetchUser()
})
