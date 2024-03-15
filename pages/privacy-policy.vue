<script setup>
const config = useRuntimeConfig();
const { locale } = useI18n();
const { data: pageData } = await useFetch(
  () => `/api/privacy-policy?locale=${locale.value}`,
  {
    baseURL: config.public.api,
  }
);
</script>
<template>
  <div class="py-5">
    <div class="container">
      <h1>{{ pageData.data.attributes.title }}</h1>
      <div class="text-dark" v-html="pageData.data.attributes.content" />
    </div>
  </div>
</template>
