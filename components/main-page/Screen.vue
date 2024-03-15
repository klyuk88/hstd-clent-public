<script setup>
const props = defineProps(["firstScreenData", "topics"]);
const localPath = useLocalePath();
</script>
<template>
  <section class="main_screen">
    <img src="@/assets/img/conference.jpg" alt="" class="main_screen-bg" />
    <div class="container position-relative" style="z-index: 10">
      <div v-html="props.firstScreenData.title"></div>
      <h3 class="my-4">{{$t('Conference Topics')}}:</h3>
      <div class="d-flex flex-column flex-lg-row">
        <ul class="m-0">
          <!-- 9 -->
          <template v-for="(item, index) in props.topics" :key="item.id">
            <li v-if="index < 9">
              {{ item.attributes.title }}
            </li>
          </template>
        </ul>
        <ul class="ms-lg-5">
          <!-- 8  -->
          <template v-for="(item, index) in props.topics" :key="item.id">
            <li v-if="index >= 9">
              {{ item.attributes.title }}
            </li>
          </template>
        </ul>
      </div>
      <div v-html="props.firstScreenData.industries" class="fisrt-screen-subtitle mt-4"></div>

      <nuxt-link :to="localPath('/account/submit')"
        ><button class="mt-3 btn btn-primary btn-lg">
          {{ $t("Submit abstract or manuscript") }}
        </button></nuxt-link
      >
    </div>
  </section>
</template>

<style lang="scss">
.main_screen {
  padding-block: 80px;
  position: relative;
  &-bg {
    position: absolute;
    left: 0;
    top: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.main_screen:after {
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba($color: #fff, $alpha: 0.8);
  z-index: 0;
  position: absolute;
}

.fisrt-screen-subtitle p {
  margin: 0;
}
</style>