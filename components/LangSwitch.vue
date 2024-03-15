<script setup>
const { locale, locales, setLocale } = useI18n();
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});
</script>
<template>
  <a
    href="#"
    class="lang-change"
    v-for="locale in availableLocales"
    :key="locale.code"
    @click.prevent.stop="$i18n.setLocale(locale.code)"
    >{{ locale.name }}</a
  >
</template>

<style lang="scss">
.lang-change {
  // margin-left: 20px;
  color: #fff;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.lang-change:hover {
  transition: opacity 0.3s ease;
  opacity: 1;
  color: #fff;
}
</style>