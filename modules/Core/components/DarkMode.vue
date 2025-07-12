<script lang="ts" setup>
  const colorMode = useColorMode()

  const isDark = shallowRef(false)

  watch(isDark, (newValue) => {
    colorMode.value = newValue ? 'dark' : 'light'
  })

  tryOnMounted(() => {
    isDark.value = colorMode.value === 'dark'
  })
</script>

<template>
  <div
    class="cursor-pointer transition-all duration-300"
    @click="isDark = !isDark"
  >
    <slot :is-dark="isDark">
      <div
        :class="[
          'flex items-center p-2 rounded-full min-w-14 transition duration-200 scale-95',
          'shadow-sm dark:bg-secondary dark:ring-1 dark:ring-gray-500 dark:bg-slate-900 ring-transparent bg-slate-400',
        ]"
      >
        <div
          :class="[
            'size-5 rounded-full transition duration-500 bg-white shadow-sm p-0.5',
            'flex items-center justify-center rtl:dark:translate-x-0 rtl:-translate-x-full ltr:translate-x-0 ltr:dark:translate-x-full',
          ]"
        >
          <Icon
            :class="[
              'text-lg transition duration-500 text-black',
              !isDark && 'rotate-180',
            ]"
            :name="!isDark ? 'ph:sun' : 'ph:moon-fill'"
          ></Icon>
        </div>
      </div>
    </slot>
  </div>
</template>
