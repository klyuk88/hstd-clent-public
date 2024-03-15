<script setup>
definePageMeta({
  middleware: "auth",
  layout: "account",
});

const { locale } = useI18n();

const localPath = useLocalePath()

const token = useToken();
const user = useUser();
const runtimeConfig = useRuntimeConfig();
const {
  refresh,
  error: manuscriptsError,
  data: manuscriptsData,
} = await useFetch(
  () =>
    `/api/manuscripts?filters[users_permissions_user][id]=${user.value.id}&filters[cancellByUser]=false&locale=${locale.value}&populate=*`,
  {
    baseURL: runtimeConfig.public.api,
    headers: {
      authorization: `Bearer ${token.value}`,
    },
  }
);

const manuscriptId = ref(null);
const modalWithDraw = ref(false);

const cancelManuscript = async () => {
  modalWithDraw.value = false;
  const { error: updateManuscriptError, data: updateManuscriptData } =
    await useFetch(`/api/manuscripts/${manuscriptId.value}`, {
      baseURL: runtimeConfig.public.api,
      method: "PUT",
      headers: {
        authorization: `Bearer ${token.value}`,
      },
      body: {
        data: {
          cancellByUser: true,
        },
      },
    });
  if (!updateManuscriptError.value) {
    await refresh();
  } else {
    return;
  }
};
const files = reactive({
  abstract: null,
  manuscript: null,
});
const successManuscript = useSuccessManuscript();

const modalRevise = ref(false);

const modalReviseHandler = (id) => {
  manuscriptId.value = id;
  modalRevise.value = true;
};

const manuscriptCancel = (id) => {
  manuscriptId.value = id;
  modalWithDraw.value = true;
};

const successReviseManuscript = ref(false);

const reviseManuscript = async () => {
  const { error, data } = await useUpdateManuscript(manuscriptId, files, locale.value);
  if (!error.value) {
    await refresh();
    modalRevise.value = false;
    successReviseManuscript.value = true;
    files.manuscript = null;
    files.abstract = null;
  } else {
    return;
    
  }
};

const {error: accountError, data: accountData} = await useFetch(
   () => `/api/stranicza-kabinet?locale=${locale.value}`,
  {
    baseURL: runtimeConfig.public.api,
  }
)

const paymentInfoModal = usePaymentInfoModal()

</script>


<template>
  <ModalsPaymentInfo v-if="paymentInfoModal"/>
  <section class="account--page">
    <div class="container-xl">
      <div
        class="modal fade withdraw"
        :class="{ show: modalWithDraw }"
        id="withdraw"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="withdraw">
                {{ $t("Are you sure? Withdraw manuscript?") }}
              </h1>
              <button
                type="button"
                class="btn-close"
                @click="modalWithDraw = false"
              ></button>
            </div>
            <div
              class="
                modal-footer
                d-flex
                justify-content-center
                align-items-center
              "
            >
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="modalWithDraw = false"
              >
                {{ $t("No") }}
              </button>
              <button
                type="button"
                class="btn btn-outline-success"
                @click="cancelManuscript"
              >
                {{ $t("Yes") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal revise-modal fade"
        :class="{ show: modalRevise }"
        tabindex="-1"
        @click.self="modalRevise = false"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="revise">
                {{ $t("Submit revise manuscript or abstract") }}
              </h1>
              <button
                type="button"
                class="btn-close"
                @click="modalRevise = false"
              ></button>
            </div>

            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="manuscript" class="form-label">{{
                    $t("Manuscript")
                  }}</label>
                  <!-- required -->
                  <!-- @change="addManuscriptFile" -->
                  <input
                    class="form-control"
                    type="file"
                    id="manuscript"
                    accept=".doc, .docx"
                    @change="files.manuscript = $event.target.files[0]"
                  />
                  <small class="text-secondary">(doc, docx)</small>
                </div>
                <div class="mb-3">
                  <label for="abstract" class="form-label">{{
                    $t("Abstract")
                  }}</label>
                  <!-- required -->
                  <!-- @change="addAbstractFile" -->
                  <input
                    class="form-control"
                    type="file"
                    id="abstract"
                    accept=".doc, .docx"
                    @change="files.abstract = $event.target.files[0]"
                  />
                  <small class="text-secondary">(doc, docx)</small>
                </div>
              </form>
            </div>

            <div
              class="
                modal-footer
                d-flex
                justify-content-center
                align-items-center
              "
            >
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="modalRevise = false"
              >
                {{ $t("Cancel") }}
              </button>

              <button
                type="button"
                class="btn btn-outline-success"
                @click="reviseManuscript"
                :disabled="files.abstract || files.manuscript ? false : true"
              >
                {{ $t("Revise manuscript") }}
                <i class="bi bi-arrow-repeat"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="account--content home">
        <h1>{{ $t("Home") }}</h1>
        <div
          class="alert alert-success success-mauscript--alert"
          role="alert"
          v-if="successReviseManuscript"
        >
          <button
            type="button"
            class="btn-close"
            @click="successReviseManuscript = false"
          ></button>
          <h4 class="alert-heading">{{ $t("Thank you for your revise!") }}</h4>
          <!-- <p>
            You will receive a notice of review from the Organizing Committee by
            e-mail. You can also check the status of the paper in submission
            systems.
          </p> -->
        </div>

        <div
          class="alert alert-success success-mauscript--alert"
          role="alert"
          v-if="successManuscript"
        >
          <button
            type="button"
            class="btn-close"
            @click="successManuscript = false"
          ></button>
          <h4 class="alert-heading">
            {{ $t("Thank you for your submission!") }}
          </h4>
          <p>
            {{ $t("You will receive") }}
          </p>
        </div>

        <div class="home--manuscript" v-if="manuscriptsData.data.length > 0">
          <div class="table-responsive">
            <table class="table manuscript--table align-middle">
              <thead>
                <tr>
                  <th style="width: 15%">{{ $t("Submission number") }}</th>
                  <th style="width: 15%">{{ $t("Paper Title") }}</th>
                  <th style="width: 15%">{{ $t("Status") }}</th>
                  <th style="width: auto">{{ $t("Decision") }}</th>
                  <th style="width: 25%">{{ $t("Actions") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in manuscriptsData.data" :key="index">
                  <td>{{ item.id }}</td>
                  <td>{{ item.attributes.title }}</td>

                  <td>
                    <template v-if="item.attributes.statusWork">
                      {{ item.attributes.statusWork.data.attributes.title }}
                    </template>
                    <template v-else>
                      {{$t('The status is empty')}}
                    </template>
                    
                  </td>
                  <td>
                    <div class="decision_cell">
                      {{
                        item.attributes.decision === null
                          ? $t('The solution will appear here')
                          : item.attributes.decision
                      }}
                    </div>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <template v-if="item.attributes.statusWork.data.attributes.slug === 'accept'">
                         <a
                        :href="accountData.data.attributes.payLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-outline-success"
                        v-if="accountData.data.attributes.payLink"
                      >
                       {{ $t("Payment") }}
                         </a>


                       <button
                        class="btn btn-outline-success"
                        @click="paymentInfoModal = true"
                        v-else
                      >

                        {{ $t("Payment") }}
                      </button>
                      </template>
                     

                      <button
                        class="btn btn-outline-primary"
                        v-if="
                          item.attributes.statusWork.data.attributes.slug === 'revise' ||
                          item.attributes.statusWork.data.attributes.slug ===
                            'accept-but'
                        "
                        @click="modalReviseHandler(item.id)"
                      >
                        {{ $t("Revise") }}
                      </button>

                      <button
                        class="btn btn-outline-danger"
                        @click="manuscriptCancel(item.id)"
                      >
                        {{ $t("Withdraw") }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p v-else>
          {{ $t("You are not registered") }}
          <NuxtLink :to="localPath('/account/submit')">{{ $t("Submit") }}</NuxtLink>
          {{ $t("or") }}
          <NuxtLink :to="localPath('/account/register')">{{ $t("Register") }}</NuxtLink>
          {{ $t("as a listener.") }}
        </p>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.payment_btn a {
  text-decoration: none;
}
.decision_cell {
  max-height: 150px;
  overflow-y: auto;
}
.manuscript--table {
  table-layout: fixed;
  min-width: 1200px;
}
.table--buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}
.account--page {
  min-height: 700px;
  padding: 50px 0 200px 0;
}

// .router-link-active.router-link-exact-active.nav-link {
//   color: #000;
// }

.modal.withdraw.show,
.modal.revise-modal.show {
  display: block;
  background: rgba($color: #000000, $alpha: 0.5);
}
</style>
