<script lang="ts" setup>
  const props = defineProps<{ keys: string[] }>()

  const controlKeys = useMagicKeys()

  const callback = controlKeys[props.keys.join('+')]

  const emit = defineEmits<{ (e: 'callback'): void }>()

  watch(callback, (newValue) => {
    if (newValue) emit('callback')
  })
</script>

<template>
  <div class="xl:flex flex-row-reverse items-center gap-x-1 flex-nowrap hidden">
    <div
      class="rounded-lg border border-gray-500 bg-slate-900 px-1 pt-1.5 pb-0.5 text-xs text-white dark:bg-slate-800"
      v-for="(item, i) in keys"
      v-text="item"
      :key="i"
    ></div>
  </div>
</template>
