<script lang="ts" setup>
  import AtlasDrawer from '../components/AtlasDrawer.vue'
  import AtlasToolbar from '../components/AtlasToolbar.vue'

  useHead({
    bodyAttrs: {
      class:
        'bg-gradient-to-br dark:from-slate-900 from-gray-50 dark:to-slate-800 to-gray-100 transition duration-500',
    },
  })
</script>

<template>
  <div class="xl:flex">
    <div class="xl:flex-1/6 xl:h-screen overflow-hidden">
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
      <div
        class="2xl:p-4 lg:p-3 p-1 lg:my-2 me-4 ms-1.5 my-1 xl:rounded-xl lg:rounded-lg rounded-md dark:bg-slate-700 bg-slate-200 2xl:min-h-[90.5%] lg:min-h-[87.2%] min-h-screen"
      >
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
