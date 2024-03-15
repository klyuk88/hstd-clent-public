<script setup>
definePageMeta({
  middleware: "auth",
  layout: "account",
});
import { ref, reactive, shallowRef, triggerRef, onUpdated } from "vue";
const { t, locale } = useI18n();

const localPath = useLocalePath();

const runtimeConfig = useRuntimeConfig();
const token = useToken();

const {error: accountError, data: accountData} = await useFetch(
   () => `/api/stranicza-kabinet?locale=${locale.value}`,
  {
    baseURL: runtimeConfig.public.api,
  }
)

const {data: participationFormat} = await useFetch(
  () => `/api/format-uchastiyas?locale=${locale.value}&populate=*`,
  {
    baseURL: runtimeConfig.public.api,
  }
)

const { error: topicsError, data: topicsData } = await useFetch(
  () => `/api/topics?locale=${locale.value}`,
  {
    baseURL: runtimeConfig.public.api,
    headers: {
      authorization: `Bearer ${token.value}`,
    },
  }
);

const { error: userError, data: user } = await useFetch(
  () => `/api/users/me?populate=*`,
  {
    baseURL: runtimeConfig.public.api,
    headers: {
      authorization: `Bearer ${token.value}`,
    },
  }
);


//files
const manuscriptFile = ref(null);
const abstractFile = ref(null);
const expertOpinion = ref(null);

const formAgree = ref(false);

const manuscriptForm = shallowRef({
  participation: null,
  title: null,
  conference_topic: null,
  presentation: null,
  users_permissions_user: {
    id: user.value.id,
  },
  authors: [],
  locale: locale.value,
  statusWork: locale.value === "ru" ? 1 : 2,
});

const continueForm = () => {
  triggerRef(manuscriptForm);
};

const backToSubmit = () => {
  manuscriptForm.value.participationFormat = null;
  manuscriptForm.presentation = null
  triggerRef(manuscriptForm);
};

const addManuscriptFile = (event) => {
  manuscriptFile.value = event.target.files[0];
};
const addAbstractFile = (event) => {
  abstractFile.value = event.target.files[0];
};
const addExpertOpinion = (event) => {
  expertOpinion.value = event.target.files[0];
};

const authors = ref([
  {
    degree: null,
    name: user.value.givenName,
    surname: user.value.surname,
    affiliation: null,
    email: user.value.email,
    corresponding: true,
  },
]);

const addAuthor = () => {
  if (authors.value.length < 10)
    authors.value.push({
      degree: null,
      name: null,
      surname: null,
      surname2: null,
      affiliation: null,
      email: null,
      corresponding: false,
    });
};
const upChangeAuthor = (index) => {
  if (index > 0) {
    [authors.value[index], authors.value[index - 1]] = [
      authors.value[index - 1],
      authors.value[index],
    ];
  }
};
const downChangeAuthor = (index) => {
  if (index + 1 < authors.value.length) {
    [authors.value[index], authors.value[index + 1]] = [
      authors.value[index + 1],
      authors.value[index],
    ];
  }
};

const deleteAuthor = (index) => {
  authors.value.splice(index, 1);
};

const successManuscript = useSuccessManuscript();
const manuscriptError = ref(null);
const sendForm = async () => {
  const { data: authorsArr, error: authorsErr } = await usePostAuthors(authors);
  if (authorsArr.value.length > 0 && authorsErr.value === null) {
    manuscriptForm.value.authors = authorsArr.value;
    const { error } = await usePostManuscript(
      manuscriptForm,
      manuscriptFile,
      abstractFile,
      expertOpinion
    );
    if (!error.value) {
      successManuscript.value = true;
      await navigateTo(localPath("/account/home"));
    } else {
      manuscriptError.value = error.value;
    }
  } else {
    manuscriptError.value = authorsErr.value;
    return;
  }
};

const setCorresponding = (index) => {
  authors.value.forEach((item, idx) => {
    if (index !== idx) {
      item.corresponding = false;
    }
  });
};
</script>
<template>
  <section class="account--page">
    <div class="container">

      <div
        class="home--header"
        v-if="manuscriptForm.participation === null"
      >
        <h1>{{ $t("Submit manuscript") }}</h1>
        <p>{{ $t("Please select a participation format") }}</p>
       
        <select
          class="form-select home--select"
          v-model="manuscriptForm.participation"
        >
          <option disabled value="">{{ $t("Please select one") }}</option>
          <option
            v-for="(option, index) in participationFormat.data"
            :key="index"
            :value="option"
          >
            {{ option.attributes.title }}
          </option>
        </select>
        <button class="btn btn-success mt-3" @click="continueForm">
          {{ $t("Continue") }}
        </button>
      </div>

      <div class="home--content" v-else>
        <div class="back-btn">
          <i class="bi bi-chevron-left"></i>
          <a href="#" class="text-dark" @click.prevent="backToSubmit">{{
            $t("Back")
          }}</a>
        </div>

        <div class="alert alert-danger" role="alert" v-if="manuscriptError">
          <h4 class="alert-heading">Error {{ manuscriptError.status }}</h4>
          <p>{{ manuscriptError.data }}</p>
        </div>

        <div>
          <h2>
            {{manuscriptForm.participation.attributes.workType === "abstract"
                ? accountData.data.attributes.abstractTitle
                : accountData.data.attributes.manuscriptTitle
            }}
          </h2>
          <h5>
            {{ accountData.data.attributes.title }}
          </h5>


          <div v-if="manuscriptForm.participation.attributes.workType === 'abstract'" v-html="accountData.data.attributes.abstractText"></div>

          <div v-if="manuscriptForm.participation.attributes.workType === 'manuscript'" v-html="accountData.data.attributes.manuscriptText"></div>

        </div>

        <form class="manuscript-form" @submit.prevent="sendForm">
          <div class="mb-3">
            <label for="manuscriptTitle" class="form-label" v-if="manuscriptForm.participation.attributes.workType === 'abstract'">{{$t("Abstract title")}}
            </label>

            <label for="manuscriptTitle" class="form-label" v-if="manuscriptForm.participation.attributes.workType === 'manuscript'">{{$t("Manuscript title")}}
            </label>

            <input
              type="text"
              class="form-control"
              id="manuscriptTitle"
              :placeholder="$t('Add a title')"
              v-model="manuscriptForm.title"
              required
            />
          </div>
          <div class="mb-3" v-if="!topicsError">
            <label class="form-label">{{ $t("Conference Topic") }}</label>
            <select
              class="form-select"
              v-model="manuscriptForm.conference_topic"
              required
            >
              <option
                v-for="(option, index) in topicsData.data"
                :key="index"
                :value="{ id: option.id }"
              >
                {{ option.attributes.title }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <h4>{{ $t("Authors") }}</h4>
            <p>{{ $t("You can add up to 10 authors") }}</p>
            <div class="table-responsive">
              <table class="table table-borderless table-sm authors--table">
                <thead>
                  <tr>
                    <th scope="col">{{ $t("Degree") }}</th>
                    <th scope="col">{{ $t("Given name") }}</th>
                    <th scope="col">{{ $t("Surname") }}</th>
                    <th scope="col" v-if="locale === 'ru'">{{ $t("Surname2") }}</th>
                    <th scope="col">{{ $t("Affiliation") }}</th>
                    <th scope="col">E-mail</th>
                    <!-- <th scope="col">Notify</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(author, index) in authors" :key="index">
                    <td>
                      <input
                        type="text"
                        class="form-control"
                        v-model="author.degree"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        class="form-control"
                        v-model="author.name"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        class="form-control"
                        v-model="author.surname"
                        required
                      />
                    </td>
                    <td
                    v-if="locale === 'ru'"
                    >
                      <input
                        type="text"
                        class="form-control"
                        v-model="author.surname2"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        class="form-control"
                        v-model="author.affiliation"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        class="form-control"
                        v-model="author.email"
                        required
                      />
                      <div class="form-check mt-1">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="author.corresponding"
                          @change="setCorresponding(index)"
                        />
                        <label class="notify--label">{{
                          $t("Corresponding author")
                        }}</label>
                      </div>
                    </td>
                    <th class="">
                      <div class="btn-group btn-group-sm">
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="upChangeAuthor(index)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-chevron-up"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                            />
                          </svg>
                          <span class="visually-hidden">Button</span>
                        </button>
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="downChangeAuthor(index)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-chevron-down"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                          </svg>
                          <span class="visually-hidden">Button</span>
                        </button>
                        <button
                          type="button"
                          class="btn btn-outline-danger"
                          :disabled="user.email === author.email"
                          @click="deleteAuthor(index)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-x"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                            ></path>
                          </svg>
                          <span class="visually-hidden">Button</span>
                        </button>
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="btn btn-light" @click="addAuthor">
              <i class="bi bi-plus"></i> {{ $t("Add author") }}
            </div>
          </div>

          <div class="mb-3">
            <h4>{{ $t("Files") }}</h4>

            <div
              class="mb-3"
              v-if="manuscriptForm.participation.attributes.workType !== 'abstract'"
            >
              <label for="manuscript" class="form-label">{{
                $t("manuscriptLabel")
              }}</label>
              <!-- required -->
              <input
                class="form-control"
                type="file"
                id="manuscript"
                accept=".doc, .docx"
                @change="addManuscriptFile"
                required
              />
              <small class="text-secondary">(.doc, .docx)</small>
            </div>

            <div class="mb-3">
              <label for="abstract" class="form-label"
                >{{ $t("Abstract") }}*</label
              >
              <!-- required -->
              <input
                class="form-control"
                type="file"
                id="abstract"
                accept=".doc, .docx"
                @change="addAbstractFile"
                required
              />
              <small class="text-secondary">(.doc, .docx)</small>
            </div>

            <!-- expert opinion start -->
            <div class="mb-3" v-if="locale === 'ru'">
              <label for="expert" class="form-label"
                >Экспертное заключение*</label
              >
              <input
                class="form-control"
                type="file"
                id="expert"
                accept=".pdf, .jpeg, .jpg"
                @change="addExpertOpinion"
                required
              />
              <small class="text-secondary">(.pdf, .jpeg, .jpg)</small>
            </div>
            <!-- expert opinion end -->
          </div>


        <!-- Presentation format start -->
          <div class="mb-3" v-if="manuscriptForm.participation.attributes.presentation_formats.data.length > 0" >
            <h4 class="mb-3">{{ $t("Presentation format") }}</h4>
     
            <div class="form-check form-check-inline"
            v-for="(item, index) in manuscriptForm.participation.attributes.presentation_formats.data" :key="item.id"
            >
              <input
                class="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                :id="item.id"
                v-model="manuscriptForm.presentation"
                :value="item.id"
                required
              />
              <label class="form-check-label" :for="item.id">{{
                item.attributes.title
              }}</label>
            </div>
          </div>
          <!-- Presentation format end -->


          <div class="mb-3">
            <h4 class="">{{ $t("Agreements") }}</h4>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="agreeField"
                v-model="formAgree"
                required
              />
              <label class="form-check-label" for="agreeField">
                <div v-if="manuscriptForm.participation.attributes.workType === 'abstract'" v-html="accountData.data.attributes.abstractAgree" class="agree-block"></div>

                <div v-if="manuscriptForm.participation.attributes.workType === 'manuscript'" v-html="accountData.data.attributes.manuscriptAgree" class="agree-block"></div>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-success w-100">
            {{
              manuscriptForm.participation.attributes.workType === 'manuscript'
                ? $t("Submit manuscript to 2nd")
                : $t("Submit abstract to 2nd")
            }}
          </button>
        </form>
      </div>

    </div>
  </section>
</template>

<style lang="scss">
.back-btn {
  padding-block: 15px;
}
.authors--manage {
  display: flex;
  align-items: center;
  span {
    padding: 5px;
    cursor: pointer;
  }
}
.list-unstyle {
  list-style: none;
  padding: 0;
}
.authors--head {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.authors--row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-columns: repeat(5, 1fr) min-content min-content;
  gap: 10px;
}

.authors--table {
  table-layout: auto;
  min-width: 900px;
}

.notify--label {
  white-space: nowrap;
  font-size: 14px;
  font-style: italic;
  opacity: 0.6;
}

.success-mauscript--alert {
  .btn-close {
    position: absolute;
    right: 15px;
  }
}

.agree-block ul {
  padding: 0;
  list-style: none!important;
}
</style>