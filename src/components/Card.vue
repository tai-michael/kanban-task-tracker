<template>
  <button @click="$emit('closeButtonClicked')" class="mb-4">Close modal</button>
  <button @click="deleteCardAndCloseModal" class="ml-4">Delete card</button>
  <ul class="flex flex-col w-full gap-y-3 h-full">
    <Title :title="store.cardSummary?.title" @title-edited="changeCardTitle" />
    <!-- TODO add due date component -->
    <CardDatePicker
      :date="store.cardSummary?.due_date"
      @date-selected="changeCardDueDate"
    />
    <CardDescription />
    <CardChecklist />
    <!-- TODO add attachment component -->
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
const Title = defineAsyncComponent(() => import('@/components/Title.vue'))
const emit = defineEmits(['closeButtonClicked'])
const store = useCardStore()

const changeCardTitle = (title: string) => {
  store.updateCardTitle(title)
}

const changeCardDueDate = (date: Date) => {
  store.updateCardDueDate(date)
}

const deleteCardAndCloseModal = () => {
  deleteCard(store.cardDetails.id)
  emit('closeButtonClicked')
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
    updateFirestoreDoc('cards', store.cardDetails.id, store.cardDetails, false)
  },
  { deep: true }
)
</script>

<style scoped lang="scss"></style>
