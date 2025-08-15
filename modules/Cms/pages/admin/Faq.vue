<script lang="ts" setup>
  import type { LayoutKey } from '#build/types/layouts'

  const {
    public: { agxicTheme },
  } = useRuntimeConfig()

  definePageMeta({
    layout: agxicTheme?.activeLayout as LayoutKey,
  })
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>
