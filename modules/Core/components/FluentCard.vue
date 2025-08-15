<script lang="ts" setup>
  import { twMerge } from 'tailwind-merge'

  interface IProps {
    outSideEffect?: boolean
    neonBorder?: boolean
    neonBorderOptions?: { onHoverVisible?: boolean }
  }

  const props = defineProps<IProps>()

  defineOptions({ inheritAttrs: false })

  const cardRef = useTemplateRef('cardEl')
  const { elementX, elementY, isOutside } = useMouseInElement(cardRef)

  const { isLargeScreen } = useDevice()

  const glowVars = computed(() => {
    if (isLargeScreen.value && isMounted()) {
      if (isOutside.value && !props.outSideEffect)
        return {
          '--glow-opacity': 0,
          '--glow-x': `${-1000}px`,
          '--glow-y': `${-1000}px`,
        }
      return {
        '--glow-x': `${elementX.value}px`,
        '--glow-y': `${elementY.value}px`,
        '--glow-opacity': 1,
      }
    } else return {}
  })
</script>

<template>
  <div
    :class="
      twMerge([
        'fluent-border-card relative',
        neonBorder && 'fluent-neon-border',
        neonBorderOptions?.onHoverVisible &&
          'after:opacity-0 after:hover:opacity-100',
        $attrs.class?.toString(),
      ])
    "
    :style="glowVars"
    ref="cardEl"
  >
    <!-- Inner Glow Layer -->
    <ClientOnly>
      <template #fallback>
        <div class="absolute inset-0 pointer-events-none z-0"></div>
      </template>
      <div
        class="absolute inset-0 pointer-events-none z-0"
        style="
          background: radial-gradient(
            600px circle at var(--glow-x, 50%) var(--glow-y, 50%),
            rgba(255, 255, 255, 0.06),
            transparent 80%
          );
          opacity: var(--glow-opacity);
          transition: opacity 0.3s ease;
        "
      />
    </ClientOnly>
    <!-- Card Content -->
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  /* Neon Border Animation */
  .fluent-neon-border::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    z-index: 2;
    pointer-events: none;
    transition: opacity 0.3s ease;
    border: 2px solid transparent;
    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
  }

  /* Inner Glow Layer */
  .fluent-border-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.3s ease;
    opacity: var(--glow-opacity, 0);
    background: radial-gradient(
      300px circle at var(--glow-x, 50%) var(--glow-y, 50%),
      rgba(91, 124, 241, 0.25),
      transparent 70%
    );
    mask-image: radial-gradient(
      circle at var(--glow-x, 50%) var(--glow-y, 50%),
      white,
      transparent 60%
    );
    -webkit-mask-image: radial-gradient(
      circle at var(--glow-x, 50%) var(--glow-y, 50%),
      white,
      transparent 60%
    );
  }
</style>
