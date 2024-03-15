<script setup>
import { reactive } from "vue";
import qs from "qs";
const { locale, locales, setLocale } = useI18n();
const config = useRuntimeConfig();

const queryObj = reactive({
  locale: locale.value,
  populate: [
    "firstScreen",
    "registration",
    "commiteeOrg",
    "commiteeOrg.avatar",
    "commiteeProg",
    "comiteeLocal",
    "submission",
    "publication",
    "publication.poster",
    "historyPhoto.gallery",
    "partners",
    "partners.logo",
  ],
});

const query = qs.stringify(queryObj);

const { error, data: mainPageData } = await useFetch(
  () => `/api/main-page?${query}`,
  {
    baseURL: config.public.api,
  }
);

const { data: topics } = await useFetch(
  () => "/api/topics?locale=" + locale.value,
  {
    baseURL: config.public.api,
  }
);
</script>
<template>
  <div>
    <MainPageScreen
      :firstScreenData="mainPageData.data.attributes.firstScreen"
      :topics="topics.data"
    />
    <MainPageAbout
      :about="mainPageData.data.attributes.aboutText"
      :registration="mainPageData.data.attributes.registration"
    />
    <MainPageCommittees
      :commitee="{
        org: mainPageData.data.attributes.commiteeOrg,
        prog: mainPageData.data.attributes.commiteeProg,
        local: mainPageData.data.attributes.comiteeLocal,
      }"
    />
    <MainPageProgramm :submission="mainPageData.data.attributes.submission" />
    <MainPagePublication
      :publication="mainPageData.data.attributes.publication"
      :publicationText="mainPageData.data.attributes.publicationText"
      :history="{
        text: mainPageData.data.attributes.historyText,
        photo: mainPageData.data.attributes.historyPhoto,
      }"
      :place="mainPageData.data.attributes.placeContent"
      :partners="mainPageData.data.attributes.partners"
    />
  </div>
</template>
