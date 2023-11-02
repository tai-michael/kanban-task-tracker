<template>
  <div class="bg-white p-8 rounded-lg">
    <div v-if="isFetchingCard">Loading card...</div>
    <div v-else>
      <button @click="$emit('close-button-clicked')">Close modal</button>
      <ul>
        <li>{{ cardStore.card.id }}</li>
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
// onMounted(() => {
//   console.log('card content mounted')
// })
// onUnmounted(() => {
//   console.log('unmounted Card Content')
// })
</script>

<style scoped lang="scss"></style>
