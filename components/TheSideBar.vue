<script setup>
import { ref } from "vue";
const token = useToken();
const user = useUser();
const userCookie = useCookie("user");
const tokenCookie = useCookie("token");

const dropDown = ref(false);

async function logout() {
  token.value = "";
  user.value = {};
  tokenCookie.value = null;
  userCookie.value = null;
  await navigateTo("/login");
}
</script>
<template>
  <div
    class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark account-sidebar"
    style="width: 280px"
    @click.self="dropDown = false"
  >
    <NuxtLink
      to="/"
      class="
        d-flex
        align-items-center
        mb-3 mb-md-0
        me-md-auto
        text-white text-decoration-none
      "
    >
      <img src="@/assets/img/mai.png" alt="" />
      <img src="@/assets/img/sverhzvuk.png" alt="" class="ms-3" />
    </NuxtLink>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <NuxtLink to="/account/home" class="nav-link">
          <i class="bi bi-house-door"></i>
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/account/submit" class="nav-link text-white">
          <i class="bi bi-envelope"></i>
          Submit
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/account/register" class="nav-link text-white">
          <i class="bi bi-check-circle"></i>
          Register as listener
        </NuxtLink>
      </li>
    </ul>
    <hr />
    <div class="dropdown">
      <a
      href="#"
        class="
          d-flex
          align-items-center
          text-white text-decoration-none
          dropdown-toggle
        "
        @click.prevent="dropDown = !dropDown"
      >
        <i class="bi bi-person-circle me-2"></i>
        <strong>{{ user.givenName }} {{ user.surname }}</strong>
      </a>
      <ul
        class="dropdown-menu dropdown-menu-dark text-small shadow"
        v-if="dropDown"
      >
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="logout">Sign out</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.account-sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
  .dropdown-menu {
    display: block;
    transform: translateY(-120%);
  }
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
  }
}
.nav-link {
  color: #fff;
}
.nav-link:hover {
  color: #fff;
}
.router-link-active.router-link-exact-active.nav-link {
  color: var(--bs-nav-pills-link-active-color) !important;
  background-color: var(--bs-nav-pills-link-active-bg);
}
</style>