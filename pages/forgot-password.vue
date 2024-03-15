<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { reactive, ref } from "vue";

const localPath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

const form = reactive({
  email: null,
});

const rules = {
  email: { required, email },
};
const v$ = useVuelidate(rules, form);

const errorData = ref(null);
const successMessage = ref(false);
async function sendForgotLink() {
  const result = await v$.value.$validate();
  if (result) {
    const { error, data } = await useFetch(`/api/auth/forgot-password`, {
      baseURL: runtimeConfig.public.api,
      method: "POST",
      body: form,
    });
    if (!error.value) {
      successMessage.value = true;
    } else {
      errorData.value = error.value.data.error.message;
    }
  } else {
    return;
  }
}
</script>
<template>
  <div>
    <section class="login">
      <div class="container">
        <div class="login--wrap">
          <h1 class="login--title">
            {{
              successMessage
                ? $t("Password reset link sent successfully!")
                : $t("Forgot password?")
            }}
          </h1>
          <p>
            {{
              successMessage
                ? $t("Check your e-mail")
                : $t("Use registered e-mail")
            }}
          </p>
          <form
            class="login--form"
            novalidate
            @submit.prevent="sendForgotLink"
            v-if="!successMessage"
          >
            <p class="login--error text-danger text-center" v-if="errorData">
              {{ errorData }}
            </p>
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('E-mail adress')"
                :class="{ 'border-danger': v$.email.$errors.length > 0 }"
                v-model="form.email"
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
            <button
              type="submit"
              class="btn bg-primary text-white login--btn mb-3"
            >
              {{ $t("Send me a reset link") }}
              <i class="bi bi-envelope-fill"></i>
            </button>
            <NuxtLink
              :to="localPath('/login')"
              class="btn btn-outline-primary w-100"
              >{{ $t("Back to login") }}</NuxtLink
            >
          </form>
          <div v-else>
            <i
              class="bi bi-check-circle-fill text-success text-center d-block"
            ></i>
            <p class="mb-0">
              {{ $t("The password reset link was sent to") }} {{ form.email }}.
              {{ $t("Please use the link") }} по эл. почте -
              <a href="mailto:hstd-conference@mai.ru">hstd-conference@mai.ru</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
