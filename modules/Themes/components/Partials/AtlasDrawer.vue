<script lang="ts" setup>
  import { Drawer } from '#components'
  import AtlasNavItem from './AtlasNavItem.vue'

  const coreStore = useCoreStore()

  const auth = useAuthStore()

  const theme = useThemeStore()

  const device = useDevice()

  const profileMenuRef = useTemplateRef('atlasProfileMenu')
</script>

<template>
  <component
    v-bind="
      device.isMobileOrTablet.value
        ? {
            visible: theme.drawerVisible,
            'onUpdate:visible': (event: boolean) =>
              theme.$patch({ drawerVisible: event }),
            'pt:header:class': '!hidden',
            'pt:content:class': '!px-3 !pb-3 flex flex-col',
            'pt:root:class': '!bg-slate-900',
            position: $i18n.localeProperties.dir !== 'rtl' ? 'right' : 'left',
          }
        : {
            class: 'px-2 pb-2 pt-4 h-full overflow-hidden flex flex-col',
          }
    "
    :is="device.isMobileOrTablet.value ? Drawer : 'aside'"
  >
    <div class="flex items-center justify-between mt-2 xl:mt-0">
      <NuxtLink class="flex items-center gap-x-2" target="_blank" to="/">
        <NuxtImg
          class="size-10"
          v-bind="
            coreStore.siteInfo?.logo
              ? { provider: 'laravel', loading: 'lazy' }
              : {}
          "
          :src="coreStore.siteInfo?.logo || '/temp/images/agxicWhite.png'"
        />
        <strong class="xl:text-2xl text-base">{{
          coreStore.siteInfo?.title || 'Site Title'
        }}</strong>
      </NuxtLink>
      <button
        class="rounded-full size-8 ring ring-gray-700 hover:bg-gray-700 transition duration-500 xl:hidden"
        @click="theme.$patch({ drawerVisible: false })"
      >
        <Icon class="size-5 mt-1" name="ph:arrow-left" />
      </button>
    </div>
    <ScrollPanel
      class="w-full h-[90%] pt-3"
      pt:content:class="flex flex-col gap-y-2"
    >
      <AtlasNavItem
        v-for="(item, i) in theme.getAccessibleNavItems"
        :active="!!item.active"
        :has-submenu="!!item.children"
        :item="item"
        :key="i"
      />
    </ScrollPanel>
    <div class="xl:flex items-center gap-x-2 hidden">
      <Button v-slot="slotProps" asChild>
        <button
          class="rounded-lg dark:bg-slate-700/50 bg-slate-300 text-gray-800 dark:text-white border-none py-1 grow h-full dark:hover:bg-slate-700 hover:bg-slate-400 font-bold cursor-pointer transition-all"
          v-bind="slotProps.a11yAttrs"
          @click="profileMenuRef?.toggle"
          aria-controls="atlas-profile-menu"
          aria-haspopup="true"
        >
          <div class="flex items-center gap-x-2 px-2">
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
              pt:root:class="2xl:!size-8 !size-5"
              shape="circle"
            ></Avatar>
            <div class="2xl:font-semibold 2xl:text-lg font-normal text-xs">
              {{ auth.user?.full_name || 'Account Name' }}
            </div>
          </div>
        </button>
      </Button>
      <Menu
        id="atlas-profile-menu"
        :model="
          theme.getProfileItems.slice(0, theme.getProfileItems.length - 2)
        "
        popup
        ref="atlasProfileMenu"
      >
        <template #itemicon="{ item }">
          <Icon v-if="item.icon" :name="item.icon" size="1.2rem" />
        </template>
      </Menu>
      <Button @click="auth.$patch({ showLogout: true })" severity="danger">
        <Icon class="2xl:size-5 size-4" name="tabler:logout" />
      </Button>
    </div>
  </component>
</template>

<style lang="scss" scoped></style>
