<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const {locale} = useI18n()

const slider = ref(null);
const onSwiper = (swiper) => {
  slider.value = swiper;
};

const props = defineProps(['publication', 'publicationText', 'history', 'place', 'partners'])

</script>

<template>
  <section class="publication bg-light py-5" id="publication">
    <div class="container">
      <h2 class="h1">{{$t('Publication')}}</h2>

      <ul class="list-group list-group-flush mt-4">
        <li
          class="list-group-item p-4 mb-2 d-flex align-items-start journal-item"
          v-for="(item, index) in props.publication" :key="index"
        >
          <img :src="$config.public.api + item.poster.data.attributes.url" alt="" class="me-3" />
          <div v-html="item.title" />
        </li>
      </ul>

      <div class="lead mt-3" v-html="props.publicationText"></div>
    </div>
  </section>

    <section class="py-5" v-if="locale === 'ru'">
    <div class="container">
      <h2 class="h1 mb-3">Место проведения</h2>
      <div class="place-content" v-html="props.place">
      </div>
    </div>
  </section>

  <section class="history py-5 bg-light" id="history">
    <div class="container">
      <h2 class="h1 mb-3">{{$t('menu.History')}}</h2>
      <div v-html="props.history.text" />
  
      <div class="mt-4">
        <Swiper
          :slides-per-view="3"
          :space-between="15"
          pagination
          navigation
          @swiper="onSwiper"
          :modules="[Navigation, Pagination]"
          :breakpoints="{
            320: {
              slidesPerView: 1
            },
            1024: {
              slidesPerView: 2
            },
          }"
          
        >
          <SwiperSlide
          v-for="(item, index) in props.history.photo.gallery.data" :key="index"
          >
            <img :src="$config.public.api + item.attributes.url" alt="" class="w-100" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
  <!-- partners start  -->
  <section class="partners py-5" v-if="props.partners.length > 0">
    <div class="container">
      <h2 class="h1 mb-3">{{$t('Partners title')}}</h2>
         <div class="py-5">
        <Swiper
          :slides-per-view="3"
          :space-between="15"
          navigation
          @swiper="onSwiper"
          :modules="[Navigation]"
          :breakpoints="{
            320: {
              slidesPerView: 1
            },
            1024: {
              slidesPerView: 3
            },
          }"
          
        >
          <SwiperSlide
          v-for="(item, index) in props.partners" :key="item.id"
          >
            <a v-if="item.link" :href="item.link" target="_blank" rel="noopener noreferrer">
            <img v-if="item.logo.data" :src="$config.public.api + item.logo.data.attributes.url" alt="" class="partner-icon" />
            </a>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
    

  </section>
  <!-- partners end  -->

</template>


<style lang="scss">
.place-content {
  width: 80%;
  @media screen and (max-width: 1200px) {
      width: 100%;
  }
}
// :root {
//   // --swiper-navigation-color: #fff;
//   // --swiper-pagination-color: #fff;
// }
.journal-item img {
  width: 80px;
}
.partner-icon {
  height: 90px;
  width: auto;
  display: block;
  margin: 0 auto;
}
</style>