<template>
  <!-- <button
    type="button"
    @click="emit('closeClicked')"
    class="absolute top-0 right-0"
  >
    <img :src="CrossIcon" />
  </button> -->

  <button type="button" @click="deleteCardAndCloseModal" class="ml-4">
    Delete card
  </button>
  <ul class="flex flex-col w-full gap-y-3 h-full">
    <Title :title="store.cardSummary?.title" @title-edited="changeCardTitle" />
    <CardDatePicker />
    <CardDescription />
    <CardChecklist />
    <CardAttachments />
  </ul>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import { useCardStore } from '@/stores'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import deleteCard from '@/composables/deleteCard'
const CardChecklist = defineAsyncComponent(
  () => import('@/components/card-details/CardChecklist.vue')
)
const CardDescription = defineAsyncComponent(
  () => import('@/components/card-details/CardDescription.vue')
)
const CardDatePicker = defineAsyncComponent(
  () => import('@/components/card-details/CardDatePicker.vue')
)
const CardAttachments = defineAsyncComponent(
  () => import('@/components/card-details/CardAttachments.vue')
)
const Title = defineAsyncComponent(() => import('@/components/Title.vue'))
const store = useCardStore()

const changeCardTitle = (title: string) => {
  store.updateCardTitle(title)
}

const emit = defineEmits(['cardDeleted'])
const deleteCardAndCloseModal = () => {
  deleteCard(store.cardDetails?.boardId, store.cardDetails.id)
  emit('cardDeleted')
}

onMounted(() => {
  if (!store.memoizedCards.some((card) => card.id === store.cardDetails.id)) {
    console.log('memoizing card')
    store.memoizeCard(store.cardDetails)
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
