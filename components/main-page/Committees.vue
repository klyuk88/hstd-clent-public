<script setup>
const props = defineProps(['commitee'])
</script>
<template>
  <section class="сommittees py-5" id="commitee">
    <div class="container">
      <h2 class="h1 mb-4">{{$t('menu.Commitee')}}</h2>
      <h3 class="text-center my-4">{{$t('Organizing Committee')}}</h3>
      <div class="row">
        <div class="col-md-6"
        v-for="(item, index) in props.commitee.org" :key="index"
        >
          <div class="сommittees-item text-center">
            <div class="сommittees-item-photo mx-auto">
              <img :src="$config.public.api + item.avatar.data.attributes.url" alt="commitee-avatar" />
            </div>
            <h5 class="сommittees-item-name mt-3">
             {{item.name}}
            </h5>
            <p class="сommittees-item-post">
              {{item.post}}
            </p>
          </div>
        </div>

        <div class="col-12">
          <div class="accordion mt-4" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  {{$t('Program Committee Members')}}
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body" v-html="props.commitee.prog.list" />
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  {{$t('Local organizing committee members')}}
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                                <!-- <ul class="list-unstyled ps-3">
                    <li>
                      I.G. Bashkirov - Head of Laboratory, Central
                      Aerohydrodynamic Institute, Russia
                    </li>
                    <li>
                      V.N. Bakulin – Lead Researcher, Institute of Applied
                      Mechanics RAS, Russia
                    </li>
                    <li>
                      N.V. Odintsova – Head of R&D Department, Institute of
                      Aviation Technology of Moscow Aviation Institute (National
                      Research University), Russia
                    </li>
                    <li>
                      A.A.Kataev – Head of Laboratory of Mathematical Modelling
                      of Moscow Aviation Institute (National Research
                      University), Russia
                    </li>
                    <li>
                      E.V. Nazarov - Head of Laboratory of Composite Materials
                      of Moscow Aviation Institute (National Research
                      University), Russia
                    </li>
                    <li>
                      D.I. Smagin – Head of Laboratory of Energy and Power
                      Systems of Moscow Aviation Institute (National Research
                      University), Russia
                    </li>
                    <li>
                      M.V. Shkurin – Senior Lecturer of Aircraft Design and
                      Certification Department of Moscow Aviation Institute
                      (National Research University), Russia
                    </li>
                    <li>
                      I.V. Polovina – Specialist of Directorate of Scientific
                      Program of Moscow Aviation Institute (National Research
                      University), Russia
                    </li>
                  </ul> -->

                <div class="accordion-body" v-html="props.commitee.local.list" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.сommittees-item-photo {
  border-radius: 50%;
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
  }
}
</style>