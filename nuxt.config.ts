// https://nuxt.com/docs/api/configuration/nuxt-config
const mailCounter = `private`;
export default defineNuxtConfig({
  app: {
    head: {
      title: "HSTD Conference 2023",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [
        {
          type: "text/javascript",
          children: mailCounter,
        },
      ],
      noscript: [],
    },
  },
  css: [
    "bootstrap-icons/font/bootstrap-icons.css",
    "@/assets/scss/common.scss",
  ],
  runtimeConfig: {
    public: {
      api:
        process.env.NODE_ENV === "development"
          ? process.env.API_URL_DEV
          : process.env.API_URL_PROD,
    },
  },
  modules: [
    "@nuxtjs/i18n",
    [
      "yandex-metrika-module-nuxt3",
      {
        id: "92567755",
        webvisor: true,
        // consoleLog: true,
        clickmap: true,
        // useCDN: false,
        trackLinks: true,
        accurateTrackBounce: true,
      },
    ],
  ],
  i18n: {
    locales: [
      {
        code: "ru",
        file: "ru-RU.json",
        name: "Ru",
      },
      {
        code: "en",
        name: "En",
        file: "en-US.json",
      },
    ],
    strategy: "prefix_except_default",
    langDir: "lang",
    defaultLocale: "ru",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
  },
});
