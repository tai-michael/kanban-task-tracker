<template>
  <div class="w-[372px]">
    <h1>{{ list.name }}</h1>

    <div v-for="card of list.cards">
      <CardPreview
        :card="card"
        @click="router.push(`/card/${card.id}`)"
      ></CardPreview>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/stores'
const CardPreview = defineAsyncComponent(
  () => import('@/components/CardPreview.vue')
)
const router = useRouter()
const props = defineProps(['list'])
const store = useCardStore()
</script>

<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1rem;
}
</style>
