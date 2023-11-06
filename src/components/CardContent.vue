<template>
  <button class="mb-4" @click="closeButtonClicked">Close modal</button>
  <ul>
    <li>{{ cardStore.activeCard.name }}</li>
    <li>{{ cardStore.activeCard.id }}</li>
    <li></li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBoardStore, useCardStore } from '@/stores'
const emit = defineEmits(['closeButtonClicked'])
const cardStore = useCardStore()

const closeButtonClicked = () => {
  emit('closeButtonClicked')
}
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
