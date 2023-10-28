<template>
  <div class="w-[372px]">
    <h1>{{ list.name }}</h1>

    <div v-for="card of list.cards">
      <CardPreview :card="card"></CardPreview>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
const CardPreview = defineAsyncComponent(
  () => import('@/components/CardPreview.vue')
)

const props = defineProps(['list'])
</script>

<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1rem;
}
</style>
