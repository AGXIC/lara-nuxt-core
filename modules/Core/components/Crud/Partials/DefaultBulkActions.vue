<script generic="T" lang="ts" setup>
  defineProps<{ selectedItems: T[] }>()

  const modal = defineModel('visible', { default: false })

  const actions = ref({})

  const emit = defineEmits<{
    (e: 'bulk', actions: IBulkEmit): IBulkEmit
  }>()
</script>

<template>
  <Dialog v-model:visible="modal" modal></Dialog>
</template>

<style lang="scss" scoped></style>
