<script setup>
const token = useToken();
const user = useUser();
const userCookie = useCookie("user");
const tokenCookie = useCookie("token");
const localPath = useLocalePath();

async function logout() {
  token.value = "";
  user.value = {};
  tokenCookie.value = null;
  userCookie.value = null;
  await navigateTo(localPath("/login"));
}



</script>
<template>
  <header class="header public_header sticky-top">
    <nav class="navbar bg-primary navbar-expand-lg">
      <div class="container-fluid">
        <NuxtLink class="navbar-brand" :to="localPath('/')">
          <img src="@/assets/img/sverhsound.png" alt="" />
          <img src="@/assets/img/mai.png" alt="" />
        </NuxtLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav" v-if="$route.path !== '/login' && $route.path !== '/en/login' ">
            <li class="nav-item">
              <NuxtLink class="nav-link" aria-current="page" to="#about">{{
                $t("menu.About")
              }}</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" aria-current="page" to="#commitee">{{
                $t("menu.Commitee")
              }}</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" aria-current="page" to="#programm">{{
                $t("menu.Program")
              }}</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" aria-current="page" to="#submission">{{
                $t("menu.Submission")
              }}</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink
                class="nav-link"
                aria-current="page"
                to="#publication"
                >{{ $t("menu.Publication") }}</NuxtLink
              >
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" aria-current="page" to="#history">{{
                $t("menu.History")
              }}</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" aria-current="page" to="#contacts">{{
                $t("menu.Contacts")
              }}</NuxtLink>
            </li>
          </ul>

          <div class="header--btns" v-if="token == ''">
            <NuxtLink :to="localPath('/login')" class="btn btn-outline-light">
              {{ $t("Login") }} <i class="bi bi-box-arrow-in-right"></i>
            </NuxtLink>
             <LangSwitch
          v-if="token === ''"
          />
          </div>

          <div class="header--btns" v-else>
            <div class="header--account-data">
              <i class="bi bi-person-circle text-light"></i>
              <NuxtLink :to="localPath('/account')" class="account-link text-white"
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

          
          <!-- <a
            class="lang-change"
            v-for="locale in $i18n.locales"
            :href="switchLocalePath(locale.code)"
            :key="locale.code"
          >
            {{ locale.name }}
          </a> -->
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

.account-link {
  text-decoration: none;
  margin-left: 5px;
}
.header.public_header {
  .nav-item a {
    color: #fff;
    transition: opacity 0.1s ease;
  }
  .nav-item a:hover {
    opacity: 0.7;
    transition: opacity 0.1s ease;
  }
}
</style>