<script lang="ts" setup>
  const auth = useAuthStore()

  const theme = useThemeStore()

  const atlasPanelProfileMenuRef = useTemplateRef('atlasPanelProfileMenu')

  const device = useDevice()

  const breadcrumb = computed(() =>
    device.isMobileOrTablet.value
      ? theme.getBreadcrumb.slice(0, 0)
      : theme.getBreadcrumb,
  )
</script>

<template>
  <Toolbar pt:root:class="!bg-transparent !rounded-none !border-none">
    <template #end>
      <Button
        class="flex items-center gap-x-2 px-2 cursor-pointer"
        @click="atlasPanelProfileMenuRef?.toggle"
        unstyled
      >
        <div class="font-semibold hidden lg:block">
          {{ auth.user?.full_name || 'Account Name' }}
        </div>
        <Avatar
          v-bind="
            auth.user
              ? {
                  ...(auth.user?.profile_photo_url
                    ? { src: auth.user.profile_photo_url }
                    : { label: auth.user.full_name.substring(0) }),
                }
              : { src: '/temp/images/userAvatar.png' }
          "
          shape="circle"
        ></Avatar>
      </Button>
      <Menu
        id="atlas-panel-profile-menu"
        :model="theme.getProfileItems"
        popup
        ref="atlasPanelProfileMenu"
      >
        <template #itemicon="{ item }">
          <Icon v-if="item.icon" :name="item.icon" size="1.2rem" />
        </template>
      </Menu>
    </template>
    <template #start>
      <div class="flex items-center">
        <Button
          class="cursor-pointer xl:hidden"
          @click="theme.$patch({ drawerVisible: !theme.drawerVisible })"
          unstyled
        >
          <Icon
            class="size-6"
            :name="
              theme.drawerVisible ? 'mingcute:close-line' : 'mingcute:menu-line'
            "
          />
        </Button>
        <Divider layout="vertical" pt:root:class="!mx-0 xl:!hidden" />
        <Breadcrumb
          :model="breadcrumb"
          pt:root:class="!bg-transparent !py-0 !ps-0"
        >
          <template #itemicon="{ item }">
            <Icon v-if="item.icon" :name="item.icon" />
          </template>
        </Breadcrumb>
      </div>
    </template>
  </Toolbar>
</template>

<style lang="scss" scoped></style>
