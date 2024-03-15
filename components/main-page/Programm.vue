<script setup>
const props = defineProps(['submission'])
</script>
<template>
  <section class="programm py-5 bg-primary text-light" id="programm">
    <div class="container">
      <h2 class="h1">{{$t('Programm')}}</h2>
<!--      <p class="lead mt-6">{{$t('Final program will be announced after August,10')}}</p>-->
      <a href="/Conference_program_HSTD_2023_TOG.pdf" class="program_file_link" target="_blank">{{$t('program_link_title')}}</a> <br>
      <a href="/online_connection _instructions.pdf" class="program_file_link" target="_blank">{{$t('program_link_title_1')}}</a>
<!--      <img src="">-->
    </div>
  </section>

  <section class="submission py-5" id="submission">
    <div class="container mb-3" v-html="props.submission.content" />
  </section>
</template>

<style lang="scss">
.program_file_link {
  color: #fff;
  transition: opacity .3s ease;
  font-size: 18px;
}
.program_file_link:hover {
  color: #fff;
  opacity: 60%;
}
.submission {
  p {
    width: 75%;
    @media (max-width: 768px) {
      width: 100%;
    }
  }
}
  
</style>