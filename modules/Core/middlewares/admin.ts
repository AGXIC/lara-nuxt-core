export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    throw createError({
      statusCode: 401,
      //  message: 'لطفا وارد شوید'
    })
  }

  if (!authStore.hasRole('admin'))
    throw createError({
      statusCode: 403,
      // message: 'دسترسی به این صفحه مجاز نیست',
    })
})
