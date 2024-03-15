<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { reactive, ref } from "vue";

definePageMeta({
  middleware: "account",
});

const localPath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

//Login data states
const token = useToken();
const user = useUser();

const tokenCookie = useCookie("token", {
  maxAge: 60 * 60 * 24,
});
const userCookie = useCookie("user", {
  maxAge: 60 * 60 * 24,
});

const form = reactive({
  identifier: null,
  password: null,
});

const rules = {
  identifier: { required, email },
  password: { required },
};
const v$ = useVuelidate(rules, form);

const errorData = ref(null);

//Login method
const login = async () => {
  //Check validation
  const result = await v$.value.$validate();

  //Validation result condition
  if (result) {
    const { error, data: userData } = await useFetch(`/api/auth/local`, {
      baseURL: runtimeConfig.public.api,
      method: "post",
      body: form,
    });
    if (!error.value) {
      //Write login data to cookies
      token.value = await userData.value.jwt;
      user.value = await userData.value.user;

      tokenCookie.value = token.value;
      userCookie.value = user.value;

      await navigateTo(localPath("/account/home"));
    } else {
      errorData.value = error.value.data.error.message;
      return;
    }
  } else {
    return;
  }
};

//change password visible
const typePassword = ref(false);
const changeTypePassword = () => {
  typePassword.value = !typePassword.value;
};
</script>
<template>
  <div>
    <section class="login">
      <div class="container">
        <div class="login--wrap">
          <h1 class="login--title">{{ $t("Login") }}</h1>
          <p class="login--error text-danger text-center" v-if="errorData">
            {{ errorData }}
          </p>
          <form class="login--form" novalidate @submit.prevent="login">
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                :class="{ 'border-danger': v$.identifier.$errors.length > 0 }"
                :placeholder="$t('E-mail adress')"
                v-model.lazy="form.identifier"
              />
              <div>
                <div
                  class="error-msg text-danger"
                  v-for="(error, idx) in v$.identifier.$errors"
                  :key="idx"
                >
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div class="mb-3 login--password">
              <i
                class="bi"
                :class="typePassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
                @click="changeTypePassword"
              ></i>
              <input
                :type="typePassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'border-danger': v$.password.$errors.length > 0 }"
                :placeholder="$t('Password')"
                v-model.lazy="form.password"
              />
              <div>
                <div
                  class="error-msg text-danger"
                  v-for="(error, idx) in v$.password.$errors"
                  :key="idx"
                >
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <NuxtLink :to="localPath('/forgot-password')" class="login--link">{{
              $t("Forgot your password?")
            }}</NuxtLink>
            <button
              type="submit"
              class="btn bg-primary text-white login--btn mb-3"
            >
              {{ $t("Login") }} <i class="bi bi-box-arrow-in-right"></i>
            </button>
            <NuxtLink
              :to="localPath('/register')"
              class="btn btn-outline-primary login--btn"
              >{{ $t("Don't you have an account?") }}</NuxtLink
            >
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.login:after {
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background: rgba($color: #fff, $alpha: 0.7);
  z-index: 0;
}
.login {
  padding-block: 200px;
  background-image: url(@/assets/img/conference.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  @media (max-width: 768px) {
    padding-block: 100px;
  }
}
.login--wrap {
  padding: 50px;
  background: #fff;
  border-radius: 20px;
  width: 600px;
  max-width: 600px;
  margin-inline: auto;
  box-shadow: 0 0 30px rgba($color: #000000, $alpha: 0.2);
  position: relative;
  z-index: 1;
  @media (max-width: 768px) {
    width: 100%;
    padding: 30px;
  }
}
.login--title {
  margin-bottom: 20px;
  font-size: 35px;
  // letter-spacing: 2px;
  text-align: center;
  // text-transform: uppercase;
}

.login--btn {
  width: 100%;
}

.login--link {
  color: #000;
  opacity: 0.4;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 20px;
}
.login--link:hover {
  color: #000;
  opacity: 0.8;
  text-decoration: underline;
}
</style>
