<template>
  <div class="bg-white p-8 rounded-lg">
    <div v-if="isFetchingCard">Loading card...</div>
    <div v-else>
      <button @click="$emit('close-button-clicked')">Close modal</button>
      <ul>
        <li>{{ cardStore.activeCard.name }}</li>
        <li>{{ cardStore.activeCard.id }}</li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBoardStore, useCardStore } from '@/stores'
const cardStore = useCardStore()
const props = defineProps(['isFetchingCard'])

onMounted(() => {
  if (!cardStore.cards.some((card) => card.id === cardStore.activeCard.id)) {
    console.log('memoizing card')
    cardStore.memoizeCard()
  }
})
// onUnmounted(() => {
//   console.log('unmounted Card Content')
// })
</script>

<style scoped lang="scss"></style>
