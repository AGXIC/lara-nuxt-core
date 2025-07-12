<script lang="ts" setup>
  import { Icon } from '#components'
  import type { TMenuItem } from '../stores/themeStore'

  const props = defineProps<{
    active: boolean
    item: TMenuItem
    hasSubmenu: boolean
    noGlow?: boolean
    expanded?: boolean
  }>()

  const parentRef = useTemplateRef('parentEl')

  const { elementX, elementY, isOutside } = useMouseInElement(parentRef)

  const device = useDevice()

  const glowVars = computed(() => {
    if (device.isDesktop.value && !isOutside.value && !props.noGlow) {
      return {
        '--glow-x': `${elementX.value}px`,
        '--glow-y': `${elementY.value}px`,
        '--glow-opacity': 1,
      }
    } else return {}
  })

  const expand = shallowRef(false)
</script>

<template>
  <div
    :class="['relative group', !noGlow && 'glow-border-card rounded-xl p-0.5']"
    :style="glowVars"
    @click="item.to ? $router.push(item.to) : (expand = !expand)"
  >
    <div
      :class="[
        'rounded-xl 2xl:px-3 px-2 2xl:py-2 py-1 relative z-10 group-hover:bg-slate-800 transition duration-300',
        expand || expanded ? 'bg-slate-800' : 'bg-slate-900',
      ]"
      ref="parentEl"
    >
      <div class="flex items-center justify-between cursor-pointer" v-ripple>
        <div class="flex items-center gap-x-2">
          <component
            class="2xl:size-6 size-5"
            v-bind="_isString(item.icon) ? { name: item.icon } : {}"
            v-if="item.icon"
            :is="_isString(item.icon) ? Icon : item.icon"
          />
          <Icon class="size-2 2xl:size-3" v-else name="tabler:circle-filled" />
          <span :class="[active && 'text-primary']">{{ item.label }}</span>
        </div>
        <Icon
          v-if="hasSubmenu"
          :class="[expand && 'rotate-180', 'transition duration-500']"
          name="tabler:chevron-down"
        />
      </div>
      <transition-group
        class="flex flex-col -mt-2"
        v-if="hasSubmenu"
        appear
        name="accordion"
        tag="div"
      >
        <template v-if="expand">
          <Divider />
          <div class="w-full flex flex-col -mt-3">
            <div
              class="relative overflow-visible"
              v-for="(child, i) in item.children"
              :key="i"
            >
              <AtlasNavItem
                class="hover:text-primary"
                :active="!!child.active"
                :has-submenu="false"
                :item="child"
                expanded
                no-glow
              />
            </div>
          </div>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .glow-border-card::before {
    content: '';
    position: absolute;
    border-radius: inherit;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.3s ease-in-out;
    opacity: var(--glow-opacity, 0);
    background: radial-gradient(
      300px circle at var(--glow-x, 50%) var(--glow-y, 50%),
      var(--p-primary-color),
      transparent 70%
    );
    mask-image: radial-gradient(
      circle at var(--glow-x, 50%) var(--glow-y, 50%),
      white,
      transparent 60%
    );
    -webkit-mask-image: radial-gradient(
      circle at var(--glow-x, 50%) var(--glow-y, 50%),
      white,
      transparent 60%
    );
  }
</style>
