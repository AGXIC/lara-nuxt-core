import type { IAuth, IPermissions, IUser } from '../types/auth'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser>()
  const roles = ref<string[]>([])
  const permissions = ref<IPermissions[]>([])
  const token = ref<string>()
  const showLogout = ref(false)

  const hasRole = (roleName: string) => roles.value.includes(roleName)

  const hasPermission = (permissionName: string | string[]) =>
    !!permissions.value.find(({ name }) =>
      typeof permissionName === 'string'
        ? (name = permissionName)
        : permissionName.includes(name),
    )

  function fetchUser() {
    const auth = useCurrentUser<IAuth>()

    if (!auth.value) {
      user.value = undefined
      roles.value = []
      permissions.value = []
    } else {
      user.value = auth.value.user
      roles.value = auth.value.roles
      token.value = auth.value.token
      permissions.value = auth.value.user.permissions
    }
  }

  return {
    // states
    user,
    roles,
    permissions,
    token,
    showLogout,
    // actions
    hasRole,
    hasPermission,
    fetchUser,
  }
})
