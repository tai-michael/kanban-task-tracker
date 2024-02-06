<template>
  <div>
    <!-- TODO change to loading bar under header instead -->
    <div v-if="isFetchingBoard && !Object.keys(boardStore.board).length">
      Loading board...
    </div>
    <Board
      v-if="Object.keys(boardStore.board).length"
      @card-selected="modal?.showModal()"
    />

    <!-- TODO eventually adjust to actual height of empty card -->
    <ModalWrapper
      ref="modal"
      :loading="isFetchingCard"
      :show-close-button="true"
      @close-triggered="router.push(`/board/${boardStore.board?.id}`)"
      :form-classes="'p-5 w-[320px] xs:w-[400px] min-h-[300px]'"
    >
      <Card
        v-if="!isFetchingCard && Object.keys(cardStore.cardDetails).length"
        @card-deleted="closeModalAndReturnToBoard"
      />
    </ModalWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch, onBeforeMount } from 'vue'
import { db } from '@/firebaseInit'
import { doc, getDoc } from 'firebase/firestore'
import { useCardStore, useBoardStore, useErrorStore } from '@/stores'
import { useRouter } from 'vue-router'
import ModalWrapper from '@/components/ModalWrapper.vue'
const Board = defineAsyncComponent(() => import('@/components/Board.vue'))
const Card = defineAsyncComponent(() => import('@/components/Card.vue'))
const router = useRouter()
const cardStore = useCardStore()
const boardStore = useBoardStore()
const errorStore = useErrorStore()
const props = defineProps(['cardId', 'boardId'])

const boardId = computed(() => props.boardId || cardStore.cardDetails.boardId)
const isFetchingBoard = ref(false)
const fetchBoardData = async (id: string) => {
  try {
    const boardRef = doc(db, 'boards_single', id)
    const boardDoc = await getDoc(boardRef)

    if (boardDoc.exists()) {
      boardStore.hydrateBoard(boardDoc.data())
      console.log(boardStore.board)
    } else {
      errorStore.triggerError(
        "The link you entered does not look like a valid Kanban link. If someone gave you this link, you may need to ask them to check that it's correct"
      )
    }
  } catch (err) {
    if (err.code === 'permission-denied') {
      console.error('Access denied:', err)
      errorStore.triggerError(
        'You do not have permission to access this board.'
      )
    } else {
      console.error('Error fetching data:', err)
    }
  }
}

const isFetchingCard = ref(false)
const fetchCard = async (id: string) => {
  try {
    const cardRef = doc(db, 'cards', id)
    const cardDoc = await getDoc(cardRef)

    if (cardDoc.exists()) {
      cardStore.hydrateCardDetails(cardDoc.data())
      console.log(cardStore.cardDetails)
    } else {
      errorStore.triggerError(
        "The link you entered does not look like a valid Kanban link. If someone gave you this link, you may need to ask them to check that it's correct"
      )
    }
  } catch (err) {
    if (err.code === 'permission-denied') {
      console.error('Access denied:', err)
      errorStore.triggerError('You do not have permission to access this card.')
    } else {
      console.error('Error fetching data:', err)
    }
  }
}

watch(
  () => props.cardId,
  async (newValue) => {
    // second condition prevents clearing card and 'find' from triggering if closing and reopening card
    if (newValue && newValue !== cardStore?.cardDetails?.id) {
      console.log('new card id detected')
      if (Object.keys(cardStore.cardDetails).length) cardStore.clearCard()

      // speeds up switching between already opened cards
      const matchingCard = cardStore.memoizedCards.find(
        (card) => card.id === newValue
      )
      if (matchingCard) return cardStore.hydrateCardDetails(matchingCard)

      isFetchingCard.value = true
      await fetchCard(props.cardId)
      isFetchingCard.value = false
    }
  }
)

watch(
  () => props.boardId,
  async (newValue) => {
    // second condition prevents refetching board from closing a card
    if (newValue && newValue !== boardStore?.board?.id) {
      console.log('new board id detected')

      isFetchingBoard.value = true
      await fetchBoardData(props.boardId)
      isFetchingBoard.value = false
    }
  }
)

onBeforeMount(async () => {
  isFetchingBoard.value = true

  if (props.cardId) {
    isFetchingCard.value = true
    await fetchCard(props.cardId)
    modal.value?.showModal()
  }
  await fetchBoardData(boardId.value)

  isFetchingBoard.value = false
  isFetchingCard.value = false
})

const modal = ref<InstanceType<typeof ModalWrapper>>()
const closeModalAndReturnToBoard = () => {
  modal.value?.close()
  router.push(`/board/${boardStore.board?.id}`)
}
</script>

<style scoped lang="scss"></style>
