<script lang="ts" setup>
  import AtlasNavItem from './AtlasNavItem.vue'

  const auth = useAuthStore()

  const theme = useThemeStore()

  const atlasPanelProfileMenuRef = useTemplateRef('atlasPanelProfileMenu')

  const device = useDevice()

  const breadcrumb = computed(() =>
    device.isMobileOrTablet.value
      ? theme.getBreadcrumb.slice(0, 0)
      : theme.getBreadcrumb,
  )

  const commandPalette = shallowRef(false)
  const searchCommand = ref('')
  const lastItemSelected = useLocalStorage('atlas-history-search', [])

  const searchedNavItems = computed(() =>
    searchCommand.value.length
      ? _flatten(
          theme.getAccessibleNavItems
            .filter(
              (item) =>
                item.label.includes(searchCommand.value) ||
                item.children?.find((child) =>
                  child.label.includes(searchCommand.value),
                ),
            )
            .map((item) => {
              if (!item.children) return item
              else item.children
            }),
        )
      : theme.getAccessibleNavItems
          .filter(({ children }) => !children)
          .slice(0, 7),
  )
</script>

<template>
  <Toolbar pt:root:class="!bg-transparent !rounded-none !border-none">
    <template #end>
      <div
        class="flex items-center gap-x-2 rtl:flex-row-reverse"
        id="atlas-toolbar-end"
        ref="atlasToolbarEnd"
      >
        <Button
          class="flex items-center gap-x-2 cursor-pointer"
          @click="atlasPanelProfileMenuRef?.toggle"
          unstyled
        >
          <Avatar
            v-bind="
              auth.user
                ? {
                    ...(auth.user?.profile_photo_url
                      ? { src: auth.user.profile_photo_url }
                      : { label: auth.user.full_name.substring(0, 1) }),
                  }
                : { src: '/temp/images/userAvatar.png' }
            "
            shape="circle"
          ></Avatar>
        </Button>
        <DarkMode />
        <slot name="toolbarProfile"></slot>
      </div>
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
    <template #center>
      <Teleport
        v-if="$refs?.['atlasToolbarEnd']"
        :disabled="!device.isMobileOrTablet.value"
        to="#atlas-toolbar-end"
      >
        <Button
          v-bind="
            device.isMobileOrTablet.value
              ? {
                  variant: 'text',
                }
              : {}
          "
          @click="commandPalette = true"
          pt:root:class="2xl:!w-96 group 2xl:opacity-80 2xl:hover:opacity-100"
          severity="secondary"
          size="small"
        >
          <div class="flex items-center grow w-full justify-between">
            <div class="flex items-center gap-x-2">
              <Icon class="size-6" name="mingcute:search-line" />
              <span>{{ $t('Search') }}</span>
            </div>
            <KBD
              class="opacity-50 group-hover:opacity-100 transition duration-300"
              :keys="['Shift', 'K']"
              @callback="commandPalette = true"
            />
          </div>
        </Button>
      </Teleport>
    </template>
  </Toolbar>
  <Dialog
    class="w-[50rem]"
    v-model:visible="commandPalette"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :header="$t('Search')"
    dismissableMask
    modal
  >
    <FieldSet :legend="$t('Menu')">
      <ScrollPanel class="w-full h-60" pt:content:class="flex flex-col gap-y-2">
        <AtlasNavItem
          v-for="(item, i) in searchedNavItems"
          :active="!!item.active"
          :hasSubmenu="!!item.children"
          :item="item"
          :key="i"
          no-icon
        />
      </ScrollPanel>
    </FieldSet>
    <slot :search="searchCommand" name="toolbarCommandPalette"></slot>
  </Dialog>
</template>

<style lang="scss" scoped></style>
