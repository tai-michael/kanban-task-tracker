<template>
  <!-- <PullRefresher /> -->
  <!-- <div class="text-center">
    <div class="mt-20 mb-10 text-3xl flex justify-center gap-3 items-end logo">
      <img :src="logo" class="w-11 h-11" /> Say It Right
    </div>
  </div> -->
  <div class="sign-in gap-y-6">
    <!-- <div class="mt-20 mb-10 text-3xl flex justify-center gap-3 items-end logo"> -->
    <img :src="logo" />
    <!-- </div> -->
    <FirebaseUI />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const FirebaseUI = defineAsyncComponent(
  () => import('@/components/FirebaseUI.vue')
)
// const PullRefresher = defineAsyncComponent(() => import('@/components/PullRefresher.vue'))
const logo = new URL('@/assets/images/logo-dark.svg', import.meta.url).href
</script>

<style lang="scss">
@media (min-width: 1024px) {
  .sign-in {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

// ion-content {
//   --background: #eef9f8;
// }

// body.dark {
//   ion-content {
//     --background: rgb(32, 32, 32);
//   }
// }

// .logo {
//   color: #25c7b1;
// }
</style>
