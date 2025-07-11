<script generic="T extends IModel" lang="ts" setup>
  defineProps<{ selectedItems?: T[] | T }>()

  const emit = defineEmits<{
    (e: 'data:restore', value: number[]): number[]
    (e: 'data:delete', value: number[]): number[]
  }>()
</script>

<template>
  <div class="flex flex-col xl:flex-row gap-2">
    <div
      class="flex flex-nowrap items-center gap-x-2 rounded-xl p-3 transition duration-500 dark:bg-blue-900/70 bg-blue-600/70 dark:hover:bg-blue-900 hover:bg-blue-600 text-white"
      v-if="
        _isArray(selectedItems) &&
        !!selectedItems.filter(({ deleted_at }) => !!deleted_at).length
      "
      @click="
        emit(
          'data:restore',
          _map(
            selectedItems.filter(({ deleted_at }) => !!deleted_at),
            'id',
          ),
        )
      "
    >
      <Icon class="size-8" name="tabler:restore" />
      <div class="flex flex-col gap-y-2">
        <div class="font-bold">{{ $t('Restore') }}</div>
        <div class="font-light">
          {{ $t('Selected Items') }}:&nbsp;
          {{ selectedItems.length }}
        </div>
      </div>
    </div>
    <div
      class="flex flex-nowrap items-center gap-x-2 rounded-xl p-3 transition duration-500 dark:bg-red-700/70 bg-red-600/70 dark:hover:bg-red-700 hover:bg-red-600 text-white"
      v-if="_isArray(selectedItems)"
      @click="emit('data:delete', _map(selectedItems, 'id'))"
    >
      <Icon class="size-8" name="tabler:trash" />
      <div class="flex flex-col gap-y-2">
        <div class="font-bold">{{ $t('Delete') }}</div>
        <div class="font-light">
          {{ $t('Selected Items') }}:&nbsp;
          {{ selectedItems.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
