<script generic="T" lang="ts" setup>
  const props = defineProps<{ fields: TFields<T>; loading?: boolean }>()

  const filters = defineModel<any>({ default: {} })

  const emit = defineEmits<{
    (e: 'data:fetch'): void
  }>()

  function selectedFilters(attribute: string) {
    const filter = _find(props.fields, ['attribute', attribute])
    if (filter) {
      if (['date', 'datetime', 'time'].includes(filter.type)) {
        switch (filter.type) {
          case 'date':
            return d(filters.value[attribute], 'date')
          case 'datetime':
            return d(filters.value[attribute], 'long')
          default:
            return d(filters.value[attribute], 'time')
        }
      } else if (filter.options) {
        return (
          _find(filter.options, ['value', filters.value[attribute]])?.label ||
          ''
        )
      } else return filters.value[attribute]
    } else return t('All')
  }

  const filterPopoverRef = useTemplateRef('filterPopoverEl')

  const activeAttr = shallowRef<{ [K in keyof T]: TField<T, K> }[keyof T]>()
</script>

<template>
  <BlockUI :blocked="loading">
    <div class="flex flex-nowrap items-center gap-x-2 py-2 px-1">
      <div class="font-semibold text-primary">{{ $t('Filters') }}:</div>
      <div class="flex flex-wrap gap-2">
        <Button
          class="hover:brightness-110 cursor-pointer"
          v-for="(item, i) in fields"
          :key="i"
          :label="`${item.label}: ${selectedFilters(item.attribute.toString())}`"
          :severity="
            Object.keys(filters).includes(item.attribute.toString())
              ? 'success'
              : 'secondary'
          "
          @click="
            (event) => {
              activeAttr = item
              filterPopoverRef?.toggle(event)
            }
          "
          rounded
          size="small"
          type="button"
        ></Button>
        <Button
          v-tooltip.top="$t('Remove All Filters')"
          :disabled="!_isEmpty(filters)"
          icon="pi pi-filter-slash"
          variant="text"
        ></Button>
        <Button
          :disabled="_isEmpty(filters)"
          @click="emit('data:fetch')"
          icon="pi pi-search"
          severity="success"
        >
          <div class="flex items-center gap-x-2 flex-nowrap">
            {{ $t('Search') }}
            <KBD
              :keys="['Ctrl', 'Enter']"
              @callback="_isEmpty(filters) ? emit('data:fetch') : undefined"
            />
          </div>
        </Button>
      </div>
    </div>
  </BlockUI>
  <Popover @hide="activeAttr = undefined" ref="filterPopoverEl">
    <div class="flex flex-col gap-y-2" v-if="activeAttr">
      <FloatLabel variant="on">
        <label :for="`field-${activeAttr.attribute.toString()}`">{{
          activeAttr?.label
        }}</label>
        <MultiSelect
          v-if="activeAttr.options"
          v-model="filters[activeAttr.attribute]"
          :display="
            filters[activeAttr.attribute]?.length > 1 ? 'chip' : 'comma'
          "
          :id="`field-${activeAttr.attribute.toString()}`"
          :options="activeAttr.options"
          filter
          fluid
          option-label="label"
          option-value="value"
        ></MultiSelect>
        <DateTimePicker
          v-else-if="['date', 'datetime', 'time'].includes(activeAttr.type)"
          v-model="filters[activeAttr.attribute]"
          :input-id="`field-${activeAttr?.attribute.toString()}`"
          :range="
            activeAttr.attribute.toString().toLowerCase().includes('between') &&
            activeAttr.type !== 'time'
          "
          :type="activeAttr.type"
          fluid
        ></DateTimePicker>
        <InputText
          v-else-if="activeAttr.type === 'string'"
          v-model="filters[activeAttr.attribute]"
          :id="`field-${activeAttr?.attribute.toString()}`"
        ></InputText>
      </FloatLabel>
      <Button
        @click="filterPopoverRef?.hide"
        icon="pi pi-check"
        severity="success"
      ></Button>
    </div>
  </Popover>
</template>

<style lang="scss" scoped></style>
