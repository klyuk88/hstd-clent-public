<script setup>
const localPath = useLocalePath();
const { locale } = useI18n();
const config = useRuntimeConfig();
const { data: contacts } = await useFetch(
  () => `/api/contact?locale=${locale.value}`,
  {
    baseURL: config.public.api,
  }
);
</script>
<template>
  <footer class="footer py-5 bg-primary text-light" id="contacts">
    <div class="container">
      <h2 class="h1 mb-4">{{ $t("Contacts") }}</h2>
      <div class="footer-content">
        <div class="">
          <h5>{{ $t("Adress") }}</h5>
          <p>{{ contacts?.data?.attributes?.adress }}</p>
          <h5>{{ $t("Phone title") }}</h5>
          <a
            :href="`tel:${contacts?.data?.attributes.phone}`"
            class="link-light mb-3 d-block"
            >{{ contacts?.data?.attributes?.phone }}</a
          >
          <h5>Email</h5>
          <a
            :href="`mailto:${contacts?.data?.attributes?.email}`"
            class="link-light"
            >{{ contacts?.data?.attributes.email }}</a
          >
        </div>

        <div class="">
          <div
            class="d-flex align-items-center mt-4 justify-content-center gap-3"
          >
            <img src="@/assets/img/mai.png" alt="" class="footer-logo" />

            <img
              src="@/assets/img/sverhsound.png"
              alt=""
              class="ms-4 footer-logo"
            />
          </div>
        </div>
        <div class="">
          <p class="text-end">{{ $t("copyright") }}</p>
          <NuxtLink
            :to="localPath('/privacy-policy')"
            target=""
            rel="noopener noreferrer"
            class="link-light opacity-50 d-block text-end"
          >
            <small class="">{{ $t("Privacy Policy") }}</small></NuxtLink
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 30px;
}
.footer-logo.wings {
  height: 60px;
  width: auto;
}

.footer-logo {
  height: 70px;
}
</style>
