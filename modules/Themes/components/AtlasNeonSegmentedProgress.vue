<script lang="ts" setup>
  interface IProps {
    percentage?: number
    size?: number
    segments?: number
    strokeWidth?: number
  }

  const props = withDefaults(defineProps<IProps>(), {
    percentage: 100,
    size: 200,
    segments: 60,
    strokeWidth: 4,
  })

  const color = computed(() => {
    const val = props.percentage / 100
    return val < 0.4
      ? 'dark:stroke-green-400 stroke-green-500'
      : val < 0.7
        ? 'stroke-orange-600'
        : 'stroke-rose-500'
  })

  const textColor = computed(() => {
    const val = props.percentage / 100
    return val < 0.4
      ? 'dark:text-green-400 text-green-500'
      : val < 0.7
        ? 'text-orange-600'
        : 'text-rose-500'
  })

  const shadowColor = computed(() => {
    const val = props.percentage / 100
    return val < 0.4 ? '#4ade80' : val < 0.7 ? '#ea580c' : '#be123c'
  })
</script>

<template>
  <div
    class="relative flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg class="-rotate-90 overflow-visible" :height="size" :width="size">
      <!-- همه خطوط پله‌ای -->
      <g
        v-for="i in segments"
        :key="i"
        :transform="`rotate(${(360 / segments) * (i - 1)} ${size / 2} ${size / 2})`"
      >
        <!-- خط فعال -->
        <line
          v-if="(i / segments) * 100 <= percentage"
          :class="[color]"
          :stroke-width="strokeWidth"
          :style="{
            filter: `drop-shadow(0 -3px 1.5px ${shadowColor}) drop-shadow(0 0 4px ${shadowColor})`,
          }"
          :x1="size / 2"
          :x2="size / 2"
          :y1="strokeWidth / 2"
          :y2="strokeWidth + 8"
          stroke-linecap="round"
        />
        <!-- خط غیر فعال -->
        <line
          class="stroke-gray-400 dark:stroke-white/20"
          v-else
          :stroke-width="strokeWidth"
          :x1="size / 2"
          :x2="size / 2"
          :y1="strokeWidth / 2"
          :y2="strokeWidth + 8"
          stroke-linecap="round"
        />
      </g>
    </svg>

    <!-- درصد وسط -->
    <div
      :class="['absolute font-bold', textColor]"
      :style="{
        fontSize: `${size / 6}px`,
        textShadow: `0 0 5px ${shadowColor}, 0 0 20px ${shadowColor}`,
      }"
    >
      {{ Math.round(percentage) }}%
    </div>
  </div>
</template>
