<script lang="ts" setup>
  import AtlasDrawer from '../components/AtlasDrawer.vue'
  import AtlasToolbar from '../components/AtlasToolbar.vue'

  useHead({
    bodyAttrs: {
      class: 'bg-gradient-to-br from-slate-900 to-slate-800',
    },
  })
</script>

<template>
  <div class="xl:flex">
    <div class="xl:flex-1/6 xl:h-screen overflow-hidden">
      <AtlasDrawer />
    </div>
    <main class="xl:flex-5/6 min-h-screen">
      <AtlasToolbar />
      <div
        class="2xl:p-4 lg:p-3 p-1 lg:my-2 me-4 ms-1.5 my-1 xl:rounded-xl lg:rounded-lg rounded-md bg-slate-700 2xl:min-h-[91.2%] lg:min-h-[87%]"
      >
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
