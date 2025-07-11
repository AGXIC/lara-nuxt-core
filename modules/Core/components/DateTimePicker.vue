<script lang="ts" setup>
  import DatePicker from 'vue3-persian-datetime-picker'
  import { format, addDays } from 'date-fns-jalali'
  import { enUS, faIR } from 'date-fns-jalali/locale'

  interface IRange {
    start: string
    end: string
  }

  interface IProps {
    inputId?: string
    type?: 'date' | 'datetime' | 'time'
    range?: boolean
  }

  const props = withDefaults(defineProps<IProps>(), { type: 'date' })

  const formatShow = computed(
    () =>
      ({
        date: 'yyyy/MM/dd',
        time: 'HH:mm:ss',
        datetime: 'yyyy/MM/dd HH:mm:ss',
      })[props.type],
  )

  const formatState = computed(
    () =>
      ({
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
        datetime: 'YYYY-MM-DD HH:mm:ss',
      })[props.type],
  )

  const modelValue = defineModel<Date | string | IRange>()

  const value = computed({
    get() {
      if (props.range)
        return !modelValue.value
          ? [
              format(new Date(), formatShow.value, {
                locale: enUS,
              }),
              format(addDays(new Date(), 2), formatShow.value, {
                locale: enUS,
              }),
            ]
          : [
              (modelValue.value as IRange).start,
              (modelValue.value as IRange).end,
            ]
      else return !modelValue.value ? new Date() : modelValue.value
    },
    set(newValue: Date | Date[]) {
      modelValue.value =
        _isString(modelValue.value) || _isDate(modelValue.value)
          ? format(newValue as Date, formatShow.value, {
              locale: enUS,
            })
          : {
              start: format((newValue as Date[])[0], formatShow.value, {
                locale: enUS,
              }),
              end: format((newValue as Date[])[1], formatShow.value, {
                locale: enUS,
              }),
            }
    },
  })

  const { locale } = useI18n()

  const date = computed(() => {
    if (modelValue.value) {
      if (_isString(modelValue.value) || _isDate(modelValue.value))
        return format(modelValue.value, formatShow.value, {
          locale: locale.value.includes('fa') ? faIR : enUS,
        })
      else
        return `${format(modelValue.value.start, formatShow.value, {
          locale: locale.value.includes('fa') ? faIR : enUS,
        })} ${t('Until')} ${format(modelValue.value.end, formatShow.value, {
          locale: locale.value.includes('fa') ? faIR : enUS,
        })}`
    } else return ''
  })

  const show = shallowRef(false)

  const inputClassActivator = useId()
</script>

<template>
  <IconField>
    <InputIcon
      :class="[type === 'time' ? 'pi pi-clock' : 'pi pi-calendar']"
    ></InputIcon>
    <InputText
      v-bind="_omit($attrs, ['readonly', 'modelValue'])"
      :class="[inputClassActivator, $attrs.class?.toString()]"
      :id="inputId"
      :model-value="date"
      @click="show = true"
      readonly
    ></InputText>
  </IconField>
  <DatePicker
    v-model="value"
    :custom-input="`.${inputClassActivator}`"
    :format="formatState"
    :range="range"
    :show="show"
    :type="type"
    @close="show = false"
  />
</template>

<style>
  @reference '~/assets/css/main.css'

  .date-picker {
    @apply dark:[&_.vpd-addon-list]:bg-dark-100 dark:[&_.vpd-body]:bg-dark-100 dark:[&_.vpd-body]:text-white dark:[&_.vpd-column-header]:text-white [&_.vpd-input-group]:hidden;
    @apply dark:[&_.vpd-content]:bg-dark-100 dark:[&_.vpd-selected]:bg-dark-100 dark:[&_.vpd-selected]:bg-opacity-100;
  }

  .date-picker .vpd-month-label {
    width: auto !important;
  }

  .date-picker .vpd-simple-content .vpd-column .vpd-column-header {
    @apply dark:text-white;
  }
</style>
