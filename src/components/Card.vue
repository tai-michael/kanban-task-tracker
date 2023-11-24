<template>
  <button class="mb-4" @click="closeButtonClicked">Close modal</button>
  <ul class="flex flex-col w-full gap-y-3 h-full">
    <Title :title="store.cardSummary.title" @title-edited="changeCardTitle" />
    <!-- TODO add due date component -->
    <CardDescription />
    <CardChecklist />
    <!-- TODO add attachment component -->
  </ul>
</template>

<script setup lang="ts">
import { watch, onMounted, defineAsyncComponent } from 'vue'
import { useCardStore } from '@/stores'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
const CardChecklist = defineAsyncComponent(
  () => import('@/components/card-details/CardChecklist.vue')
)
const CardDescription = defineAsyncComponent(
  () => import('@/components/card-details/CardDescription.vue')
)
const Title = defineAsyncComponent(() => import('@/components/Title.vue'))
const emit = defineEmits(['closeButtonClicked'])
const store = useCardStore()
const closeButtonClicked = () => {
  emit('closeButtonClicked')
}

const changeCardTitle = (title: string) => {
  store.updateCardTitle(title)
}

onMounted(() => {
  if (!store.cards.some((card) => card.id === store.cardDetails.id)) {
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
