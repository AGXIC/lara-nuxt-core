<script lang="ts" setup></script>

<template>
  <div
    :class="
      twMerge(
        'xl:rounded-xl lg:rounded-lg rounded-md dark:bg-slate-700 bg-slate-200',
        $attrs.class?.toString(),
      )
    "
  >
    <slot></slot>
  </div>
</template>
