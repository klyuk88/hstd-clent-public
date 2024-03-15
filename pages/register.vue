<script setup>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  minLength,
  numeric,
  sameAs,
} from "@vuelidate/validators";
import { reactive } from "vue";

definePageMeta({
  middleware: "account",
});
const { locale } = useI18n();
const localPath = useLocalePath();

const config = useRuntimeConfig();
const form = reactive({
  username: null,
  givenName: null,
  surname: null,
  affiliation: null,
  email: null,
  phone: null,
  password: null,
  agree: false,
});

const rules = {
  surname: {
    required,
  },
  givenName: {
    required,
  },
  affiliation: {
    required,
  },
  email: {
    required,
    email,
  },
  phone: {
    required,
    numeric,
  },
  password: {
    required,
    minLength: minLength(8),
  },
  agree: {
    sameAs: helpers.withMessage("You have to agree", sameAs(true)),
  },
};

//Login data states
const token = useToken();
const user = useUser();

const tokenCookie = useCookie("token", {
  maxAge: 60 * 60 * 24,
});
const userCookie = useCookie("user", {
  maxAge: 60 * 60 * 24,
});

const v$ = useVuelidate(rules, form);
const errorData = ref(null);
const register = async () => {
  const result = await v$.value.$validate();
  if (result) {
    form.username = form.email;
    const { error, data: userData } = await useFetch(
      () => `/api/auth/local/register`,
      {
        baseURL: config.public.api,
        method: "POST",
        body: form,
      }
    );
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
          <h1 class="login--title">{{ $t("Registration") }}</h1>
          <p class="login--error text-danger text-center" v-if="errorData">
            {{ errorData }}
          </p>
          <form class="login--form" @submit.prevent="register">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    :class="{
                      'border-danger': v$.givenName.$errors.length > 0,
                    }"
                    :placeholder="$t('Given name')"
                    v-model.lazy="form.givenName"
                  />
                  <div>
                    <div
                      class="error-msg text-danger"
                      v-for="(error, idx) in v$.givenName.$errors"
                      :key="idx"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="$t('Surname')"
                    :class="{ 'border-danger': v$.surname.$errors.length > 0 }"
                    v-model.lazy="form.surname"
                  />
                  <div>
                    <div
                      class="error-msg text-danger"
                      v-for="(error, idx) in v$.surname.$errors"
                      :key="idx"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="$t('Affiliation')"
                    :class="{
                      'border-danger': v$.affiliation.$errors.length > 0,
                    }"
                    v-model.lazy="form.affiliation"
                  />
                  <div>
                    <div
                      class="error-msg text-danger"
                      v-for="(error, idx) in v$.affiliation.$errors"
                      :key="idx"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <input
                    type="tel"
                    class="form-control"
                    :placeholder="$t('Phone')"
                    :class="{ 'border-danger': v$.phone.$errors.length > 0 }"
                    v-model.lazy="form.phone"
                  />
                  <div>
                    <div
                      class="error-msg text-danger"
                      v-for="(error, idx) in v$.phone.$errors"
                      :key="idx"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <input
                    class="form-control"
                    :placeholder="$t('E-mail adress')"
                    :class="{ 'border-danger': v$.email.$errors.length > 0 }"
                    v-model.lazy="form.email"
                  />
                  <div>
                    <div
                      class="error-msg text-danger"
                      v-for="(error, idx) in v$.email.$errors"
                      :key="idx"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3 login--password">
                  <i
                    class="bi"
                    :class="typePassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
                    @click="changeTypePassword"
                  ></i>
                  <input
                    :type="typePassword ? 'text' : 'password'"
                    class="form-control"
                    :placeholder="$t('Password')"
                    :class="{ 'border-danger': v$.password.$errors.length > 0 }"
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
              </div>
            </div>

            <button
              type="submit"
              class="btn bg-primary text-white login--btn mb-3"
            >
              {{ $t("Register") }}
            </button>
            <NuxtLink
              :to="localPath('/login')"
              class="btn btn-outline-primary w-100"
              >{{ $t("Back to login") }}</NuxtLink
            >

            <div class="form-check mt-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="defaultCheck1"
                :class="{ 'border-danger': v$.agree.$errors.length > 0 }"
                v-model.lazy="form.agree"
              />
              <label class="form-check-label" for="defaultCheck1">
                <template v-if="locale === 'ru'">
                  Я согласен с
                  <NuxtLink :to="localPath('/privacy-policy')"
                    >политикой конфиденциальности</NuxtLink
                  >
                  и согласен получать информационную рассылку
                </template>
                <template v-else>
                  I agree with the
                  <NuxtLink :to="localPath('/privacy-policy')"
                    >privacy policy</NuxtLink
                  >
                  and agree to receive the newsletter
                </template>
              </label>
              <div
                class="error-msg text-danger"
                v-for="(error, idx) in v$.agree.$errors"
                :key="idx"
              >
                {{ error.$message }}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
<style lang="scss">
.error-msg {
  font-size: 14px;
}
.login--password {
  position: relative;
  i {
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px;
    right: 5px;
    opacity: 0.5;
    cursor: pointer;
  }
}
</style>
