<script lang="ts" setup>
  const auth = useAuthStore()

  const props = defineProps<{
    pageName: string
    restorable?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'data:show'): void
    (e: 'data:restore'): void
    (e: 'data:duplicate'): void
    (e: 'data:delete'): void
  }>()

  const device = useDevice()

  const id = useId()

  const actionItems = computed(() => [
    ...(auth.hasPermission(`${props.pageName}-duplicate`)
      ? [
          {
            label: t('Duplicate'),
            icon: 'pi pi-clone',
            severity: 'warn',
            command: () => emit('data:duplicate'),
          },
        ]
      : []),
    ...(auth.hasPermission(`${props.pageName}-restore`)
      ? [
          {
            label: t('Restore'),
            icon: 'pi pi-undo',
            severity: 'info',
            command: () => emit('data:restore'),
          },
        ]
      : []),
    ...(props.restorable || auth.hasPermission(`${props.pageName}-duplicate`)
      ? [
          {
            separator: true,
          },
        ]
      : []),
    ...(auth.hasPermission(`${props.pageName}-edit`)
      ? [
          {
            label: t('Show'),
            icon: 'pi pi-pen-to-square',
            severity: 'info',
            command: () => emit('data:show'),
          },
        ]
      : []),
    ...(auth.hasPermission(`${props.pageName}-delete`)
      ? [
          {
            label: t('Delete'),
            icon: 'pi pi-trash',
            severity: 'danger',
            command: () => emit('data:delete'),
          },
        ]
      : []),
  ])

  const menuRef = useTemplateRef('menuEl')
</script>

<template>
  <template v-if="device.isMobileOrTablet.value">
    <Button
      :aria-controls="id"
      @click="menuRef?.toggle"
      aria-haspopup="true"
      icon="pi pi-ellipsis-v"
      severity="warn"
      type="button"
      variant="text"
    />
    <Menu
      :id="id"
      :model="actionItems.map((item) => _omit(item, ['severity']))"
      :popup="true"
      ref="menuEl"
    />
  </template>
  <template v-else>
    <Button
      v-for="(item, i) in actionItems.filter(({ separator }) => !separator)"
      v-tooltip.top="item.label"
      :icon="item.icon"
      :key="i"
      :severity="item.severity"
      @click="item.command"
      rounded
      variant="text"
    ></Button>
  </template>
</template>

<style lang="scss" scoped></style>
