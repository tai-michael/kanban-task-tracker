<template>
  <div>
    <h1>{{ list.name }}</h1>

    <div v-for="card of list.cards">
      <Card :card="card"></Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
const Card = defineAsyncComponent(() => import('@/components/Card.vue'))

const props = defineProps(['list'])
</script>

<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1rem;
}
</style>
