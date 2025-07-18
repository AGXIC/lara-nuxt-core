<script lang="ts" setup>
  import { AtlasCardView } from '#components'
  import AtlasDrawer from '../components/Partials/AtlasDrawer.vue'
  import AtlasToolbar from '../components/Partials/AtlasToolbar.vue'

  useHead({
    bodyAttrs: {
      class:
        'bg-gradient-to-br dark:from-slate-900 from-gray-50 dark:to-slate-800 to-gray-100 transition duration-500',
    },
  })
</script>

<template>
  <div class="xl:flex relative">
    <div class="xl:flex-1/6 xl:min-h-screen overflow-hidden">
      <AtlasDrawer />
    </div>
    <main class="xl:flex-5/6 min-h-screen">
      <AtlasToolbar>
        <template
          v-for="(item, i) in Object.keys($slots)"
          :key="i"
          #[item]="slotProps"
        >
          <slot v-bind="slotProps" :name="item"></slot>
        </template>
      </AtlasToolbar>
      <component
        :class="[
          '2xl:p-4 lg:p-3 p-1 lg:my-2 me-4 ms-1.5 my-1',
          !$attrs.noCardView &&
            '2xl:min-h-[90.5%] lg:min-h-[87.2%] min-h-screen',
        ]"
        :is="!$attrs.noCardView ? AtlasCardView : 'div'"
      >
        <slot />
      </component>
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
