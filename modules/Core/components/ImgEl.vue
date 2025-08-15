<script lang="ts" setup>
  interface IProps {
    alt?: string
    src?: string
    preview?: boolean
    preload?: boolean
    imageOptions?: { width?: string; height?: string; quality?: number }
    sizes?: string
  }

  const props = defineProps<IProps>()

  defineOptions({ inheritAttrs: false })

  const imageBind = computed(() => ({
    alt: props.alt,
    ...props.imageOptions,
    ...(props.src?.startsWith('http') && { provider: 'laravel' }),
    src: props.src,
    format: 'webp',
    preload: props.preload,
    sizes: props.sizes,
  }))
</script>

<template>
  <Image v-bind="{ preview, alt }" :pt:root="$attrs.class?.toString()">
    <template #previewicon>
      <Icon name="tabler:eye" />
    </template>
    <template #image>
      <NuxtImg v-bind="imageBind" />
    </template>
    <template #original="slotProps">
      <NuxtImg
        v-bind="_omit(imageBind, ['height', 'width', 'preload', 'sizes'])"
        :style="slotProps.style"
        @click="slotProps.previewCallback()"
        loading="lazy"
      />
    </template>
  </Image>
</template>

<style lang="scss" scoped></style>
