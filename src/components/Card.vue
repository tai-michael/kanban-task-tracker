<template>
  <button class="mb-4" @click="closeButtonClicked">Close modal</button>
  <ul>
    <li>{{ store.cardSummary.title }}</li>
    <li>{{ store.cardSummary.id }}</li>
    <li>{{ store.cardDetails.description }}</li>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useCardStore } from '@/stores'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
const emit = defineEmits(['closeButtonClicked'])
const store = useCardStore()
const closeButtonClicked = () => {
  emit('closeButtonClicked')
}
onMounted(() => {
  if (!store.cards.some((card) => card.id === store.cardDetails.id)) {
    console.log('memoizing card')
    store.memoizeCard()
  }
})

watch(
  () => store.cardDetails,
  () => {
    console.log('triggered card details watcher')
    updateFirestoreDoc('cards', store.cardDetails.id, store.cardDetails)
  },
  { deep: true }
)
</script>

<style scoped lang="scss"></style>
