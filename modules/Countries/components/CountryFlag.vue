<script lang="ts" setup>
  import 'flag-icons/css/flag-icons.css'
  import { twJoin } from 'tailwind-merge'

  interface IProps {
    code: string
    size?: string
    rounded?: boolean
    fis?: boolean
  }

  withDefaults(defineProps<IProps>(), { size: '2rem' })

  const attrs = useAttrs()

  const otherClasses = attrs?.class as string | undefined
</script>

<template>
  <span
    :class="[
      `fi-${code.toLowerCase()}`,
      fis && 'fis',
      twJoin(
        otherClasses,
        rounded && 'rounded-full bg-cover bg-center aspect-square',
      ),
    ]"
    :style="{
      'font-size': size,
    }"
  ></span>
</template>

<style lang="scss" scoped></style>
