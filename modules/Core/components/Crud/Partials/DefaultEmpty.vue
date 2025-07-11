<script lang="ts" setup>
  defineProps<{ pronounce?: string; loading?: boolean; pageName?: string }>()

  const auth = useAuthStore()

  const emit = defineEmits<{
    (e: 'data:create'): void
    (e: 'data:refresh'): void
  }>()
</script>

<template>
  <div class="flex flex-col items-center gap-y-3 py-20">
    <Icon class="text-3xl" name="fluent:cube-16-regular" />
    <div class="mt-3">
      {{
        $t('No record found', {
          record: pronounce || t('record'),
        })
      }}
    </div>
    <div class="mt-5 flex items-center gap-x-2">
      <Button
        v-if="auth.hasPermission(`${pageName}-add`)"
        :label="
          $t('Add', {
            name: pronounce || t('record'),
          })
        "
        @click="emit('data:create')"
        icon="pi pi-plus-circle"
      ></Button>
      <Button
        :label="$t('Refresh')"
        :loading="loading"
        @click="emit('data:refresh')"
        icon="pi pi-sync"
        severity="secondary"
        variant="text"
      ></Button>
    </div>
  </div>
</template>
