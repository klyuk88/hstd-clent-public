<script setup>
import { ref } from "vue";
const token = useToken();
const user = useUser();
const userCookie = useCookie("user");
const tokenCookie = useCookie("token");
const localPath = useLocalePath()
async function logout() {
  token.value = "";
  user.value = {};
  tokenCookie.value = null;
  userCookie.value = null;
  await navigateTo(localPath("/login"));
}

const showMobNav = ref(false);
const { locale, locales, setLocale } = useI18n();
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});

</script>
<template>
  <header class="header account-header">
    <nav class="navbar navbar-dark bg-primary navbar-expand-lg">
      <div class="container-fluid">
        <NuxtLink class="navbar-brand" :to="localPath('/')">
          <img src="@/assets/img/sverhsound.png" alt="" />
          <img src="@/assets/img/mai.png" alt="" />
        </NuxtLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav">
            <li class="nav-item">
              <NuxtLink class="nav-link" aria-current="page" :to="localPath('/account/home')"
                >{{$t('Home')}}</NuxtLink
              >
            </li>
            <li class="nav-item">
              <NuxtLink
                class="nav-link"
                aria-current="page"
                :to="localPath('/account/submit')"
                >{{$t('Submit')}}</NuxtLink
              >
            </li>
            <li class="nav-item">
              <NuxtLink
                class="nav-link"
                aria-current="page"
                :to="localPath('/account/register')"
                >{{$t('Register as a listener')}}</NuxtLink
              >
            </li>
          </ul>

          <div class="header--btns" v-if="token == ''">
            <NuxtLink :to="localPath('/login')" class="btn bg-primary text-white">
              {{$t('Login')}} <i class="bi bi-box-arrow-in-right"></i>
            </NuxtLink>
          </div>

          <div class="header--btns" v-else>
            <div class="header--account-data">
              <i class="bi bi-person-circle text-light"></i>
              <NuxtLink :to="localPath('/account/home')" class="account-link"
                >{{ user.givenName }} {{ user.surname }}</NuxtLink
              >
            </div>

            <a
              href="#"
              class="btn btn-outline-light header--btns"
              @click.prevent="logout"
            >
              {{$t('Logout')}} <i class="bi bi-box-arrow-left"></i>
            </a>
          </div>

          <!-- <LangSwitch/> -->

          <!-- <div class="theme-mode">
              <i class="bi bi-brightness-high-fill"></i>
              <i class="bi bi-moon-fill"></i>
            </div> -->
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss">
.navbar-brand img {
  height: 40px;
  width: auto;
  margin-right: 10px;
}

.header--btns {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 15px;
}

.header.account-header {
  .router-link-active {
    color: #fff;
  }

  .account-link {
    text-decoration: none;
    color: #fff;
    margin-left: 5px;
  }
}
</style>