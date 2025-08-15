export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const themeStore = useThemeStore()

  if (!authStore.user) {
    throw createError({
      statusCode: 401,
      //  message: 'لطفا وارد شوید'
    })
  }

  const hasAccess = themeStore.navItems.some((navItem) => {
    if (navItem.to?.name === to.name) return !!navItem.can
    if (navItem.children)
      return navItem.children.some(
        (child) => child.to.name === to.name && child.can,
      )
    return false
  })

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      // message: 'دسترسی به این صفحه مجاز نیست',
    })
  }
})
