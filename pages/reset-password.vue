<script setup>
definePageMeta({
  middleware: "password",
});
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
import { reactive, ref } from "vue";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const localPath = useLocalePath();

const form = reactive({
  code: route.query.code,
  password: null,
  passwordConfirmation: null,
});

const rules = {
  password: { required },
  passwordConfirmation: { required },
};

const v$ = useVuelidate(rules, form);

const errorData = ref(null);
async function resetPassword() {
  const result = await v$.value.$validate();
  if (result) {
    const { error, data } = await useFetch(`/api/auth/reset-password`, {
      baseURL: runtimeConfig.public.api,
      method: "POST",
      body: form,
    });
    if (!error.value) {
      await navigateTo(localPath("/login"));
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
          <form class="login--form" novalidate @submit.prevent="resetPassword">
            <h1 class="login--title">{{ $t("reset_password") }}</h1>

            <p class="login--error text-danger text-center" v-if="errorData">
              {{ errorData }}
            </p>
            <div class="mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Сreate a new password"
                :class="{ 'border-danger': v$.password.$errors.length > 0 }"
                v-model="form.password"
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
            <div class="mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Confirm a new password"
                :class="{
                  'border-danger': v$.passwordConfirmation.$errors.length > 0,
                }"
                v-model="form.passwordConfirmation"
              />
              <div>
                <div
                  class="error-msg text-danger"
                  v-for="(error, idx) in v$.passwordConfirmation.$errors"
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
              {{ $t("reset_password") }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
