<script lang="ts" setup>
  import VueCountDown from '@chenfengyuan/vue-countdown'
  import { transformSlotProps } from '../utils/vueCountDown'

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps<{
    startDate?: Date | string
    endDate?: Date | string
    noAutoStart?: boolean
  }>()

  const emit = defineEmits<{ (e: 'end'): void }>()

  const time = computed(
    () =>
      (new Date(props.endDate || '') as any) -
      (new Date(props.startDate || '') as any),
  )
</script>

<template>
  <VueCountDown
    v-slot="{
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    }"
    :auto-start="!noAutoStart"
    :interval="100"
    :time="time"
    :transform="transformSlotProps"
    @end="emit('end')"
  >
    <slot
      v-bind="{
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
      }"
    ></slot>
  </VueCountDown>
</template>

<style lang="scss" scoped></style>
