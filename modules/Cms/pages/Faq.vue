<script lang="ts" setup>
  const faqItems = ref([])

  useSchemaOrg({
    '@type': 'FAQPage',
    mainEntity: faqItems.value.map((faq) => ({
      '@type': 'Question',
      // name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        // text: faq.answer,
      },
    })),
  })

  defineOptions({
    serverPrefetch() {},
  })
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>
