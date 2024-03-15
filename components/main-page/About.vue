<script setup>
const props = defineProps(["about", "registration"]);
</script>
<template>
  <section class="about py-5" id="about">
    <div class="container">
      <h2 class="h1">{{$t('menu.About')}}</h2>
      <div class="about-text" v-html="props.about"></div>
    </div>
  </section>
  <section class="registration py-5 bg-light">
    <div class="container">
      <h2 class="h1">{{$t('Registration')}}</h2>
      <div
        class="border border-primary p-4 mt-4"
        v-html="props.registration.title"
      />

      <div class="price_table mt-5" v-html="props.registration.table" />
      <div
        class="border border-primary mt-3 p-4"
        v-html="props.registration.include"
      />
    </div>
  </section>
</template>
<style lang="scss">
.price_table {
  table {
    border: 1px solid #eee;
    table-layout: fixed;
    width: 100%;
  }
  table td {
    padding: 10px;
  }
  table tbody tr:nth-child(odd) {
    background: #fff;
  }
  table tbody tr:nth-child(even) {
    background: #f7f7f7;
  }
  // p {
  //   font-size: 1.25rem;
  //   font-weight: 300;
  // }
}
.about-text {
  width: 75%;
  @media (max-width: 768px) {
    width: 100%;
  }
}
</style>