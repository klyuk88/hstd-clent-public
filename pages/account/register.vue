<script setup>
definePageMeta({
  middleware: "auth",
  layout: "account",
});
const runtimeConfig = useRuntimeConfig();
const token = useToken();

const {locale} = useI18n()
const localPath = useLocalePath()

const { refresh, error: userError, data: user } = await useFetch(() => `/api/users/me`, {
  headers: {
    authorization: `Bearer ${token.value}`,
  },
  method: "GET",
  baseURL: runtimeConfig.public.api,
});

const successRegister = ref(false);

const registerListener = async () => {
  if (!userError.value) {
    const { error, data } = useFetch(() => `/api/users/${user.value.id}`, {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
      baseURL: runtimeConfig.public.api,
      method: "PUT",
      body: {
        listener: true,
      },
    });
    if (!error.value) {
      successRegister.value = true;
    }
  } else {
    return
  }
};
</script>
<template>
  <section class="account--page">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="mb-4">{{$t('Register as a listener')}}</h1>

          <!-- sucess register  -->
          <div
            class="alert alert-success success-mauscript--alert"
            role="alert"
            v-if="successRegister"
          >
           
            <h4 class="alert-heading">{{$t('Thank you for registering!')}}</h4>
            <!-- <p>
            You will receive a notice of review from the Organizing Committee by
            e-mail. You can also check the status of the paper in submission
            systems.
          </p> -->
          </div>

          <p>
            {{
              user.listener || successRegister
                ? $t('You have already registered')
                : $t('On 2nd International Conference')
            }}
          </p>
          <button
            class="btn btn-success btn-lg"
            @click="registerListener"
            v-if="user.listener || successRegister ? false : true"
          >
            {{$t('Registration')}}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>