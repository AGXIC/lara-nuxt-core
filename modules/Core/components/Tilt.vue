<script lang="ts" setup>
  import type { DefineComponent } from 'vue'

  const props = withDefaults(
    defineProps<{
      tag?: string | DefineComponent
      maxRotation?: number
    }>(),
    { tag: 'div', maxRotation: 6 },
  )

  const cardEl = ref()

  const { elementHeight, elementWidth, elementX, elementY, isOutside } =
    useMouseInElement(cardEl)

  const cardTransform = computed(() => {
    const MAX_ROTATION = props.maxRotation

    const rX = (
      MAX_ROTATION / 2 -
      (elementY.value / elementHeight.value) * MAX_ROTATION
    ).toFixed(2)

    const rY = (
      (elementX.value / elementWidth.value) * MAX_ROTATION -
      MAX_ROTATION / 2
    ).toFixed(2)

    return isOutside.value || window.screen.width
      ? ''
      : `perspective(${elementWidth.value}px) rotateX(${rX}deg) rotateY(${rY}deg)`
  })
</script>

<template>
  <component
    :is="tag"
    :style="{
      transform: cardTransform,
      transition: 'transform 0.25s ease-out',
    }"
    ref="cardEl"
  >
    <slot />
  </component>
</template>
