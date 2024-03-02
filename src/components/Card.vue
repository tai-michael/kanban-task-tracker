<template>
  <div class="absolute top-1 xs:top-1.5 left-3 xs:left-2.5">
    <EllipsisMenu
      :delete-button-label="deleteButtonLabel"
      :delete-confirmation-header="deleteConfirmationHeader"
      :delete-confirmation-body="deleteConfirmationBody"
      @delete-confirmed="deleteCardAndCloseModal"
      :popover-classes="'left-0'"
    />
  </div>

  <div
    class="h-12 bg-[var(--light-gray-light-bg)] xs:bg-[unset] border-b xs:border-0"
  ></div>

  <ul class="flex flex-col w-full h-full pb-5 px-5 pt-2 xs:pt-0">
    <div class="flex flex-col gap-x-2 mb-7">
      <div
        class="relative flex justify-between mb-1 ml-[var(--card-gutter-mobile)] xs:ml-[var(--card-gutter-desktop)]"
      >
        <div class="absolute top-[8px] left-[-35px]">
          <CardIcon :color="'hsla(218, 24%, 35%, 75%)'" />
        </div>
        <Title
          :title="store.cardSummary?.title"
          @title-edited="changeCardTitle"
          class="block max-w-[455px] mb-3 py-1.5 text-xl font-bold text-[var(--card-text)]"
        />
      </div>

      <div class="xs:ml-[var(--card-gutter-desktop)]">
        <CardDatePicker />
      </div>
    </div>
    <CardDescription />
    <CardChecklist />
    <CardAttachments />
  </ul>
</template>

<script setup lang="ts">
import { watch, onMounted, defineAsyncComponent, onUnmounted } from 'vue'
import EllipsisMenu from '@/components/EllipsisMenu.vue'
import CardIcon from '@/assets/icons/icon-card.vue'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import deleteCard from '@/composables/deleteCard'
import { useCardStore } from '@/stores'
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

const deleteButtonLabel = 'Delete card'
const deleteConfirmationHeader = 'Delete this card?'
const deleteConfirmationBody = `Are you sure you want to delete this card? This action cannot be reversed.`

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

// The active card's board id is used to determine active board in sidebar when a card is displayed. It's therefore necessary to clear the card id when navigating to another board; otherwise, the previous board will show as active in addition to the new board in sidebar
onUnmounted(() => {
  store.clearCard()
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
