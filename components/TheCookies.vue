<script setup>
const { locale } = useI18n();
const agree = useCookie("agree");
const agreeCookie = () => {
  agree.value = true;
};
</script>

<template>
  <div
    class="
      cookie
      px-5
      py-4
      d-flex
      flex-column
      flex-lg-row
      align-items-center
      position-fixed
      bottom-0
      end-0
      bg-white
      shadow-lg
      mb-3
      me-0
      me-lg-3
      gap-2
      gap-lg-5
      text-center
      text-lg-start
    "
    v-if="!agree"
  >
    <template v-if="locale === 'ru'">
      <p class="m-0">
        Продолжая использовать наш сайт, вы даете согласие на обработку файлов
        cookie, которые обеспечивают правильную работу сайта.
      </p>
      <button class="btn btn-primary px-5" @click="agreeCookie()">
        Принять
      </button>
    </template>

    <template v-else>
      <p class="m-0">
        By continuing to use our site, you consent to the processing of cookies
        that ensure the correct operation of the site.
      </p>
      <button class="btn btn-primary px-5" @click="agreeCookie()">Agree</button>
    </template>
  </div>
</template>
<style lang="scss">
.cookie {
  z-index: 100;
  width: 50%;
  @media screen and (max-width: 1200px){
    width: 100%;
  }
}
</style>
