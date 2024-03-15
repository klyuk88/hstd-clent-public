<script setup>
const paymentInfoModal = usePaymentInfoModal()
</script>

<template>
  <div class="modal d-block" style="background-color: rgba(0,0,0,0.5)" @click.self="paymentInfoModal = false">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0">
        <button type="button" class="btn-close" @click="paymentInfoModal = false"></button>
      </div>
      <div class="modal-body">
        <h3 class="text-center fw-normal fs-4">{{$t('paymentInfo')}}</h3>
        <button class="btn btn-primary px-4 py-2 mx-auto d-block mt-4" @click="paymentInfoModal = false">Закрыть</button>
      </div>
      
    </div>
  </div>
</div>
</template>