<template>
  <div>
    <div v-if="isFetchingBoard">Loading board...</div>
    <Board v-else="boardStore.board" />

    <transition name="fade">
      <div
        v-if="cardId"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto"
      >
        <div class="bg-white p-8 rounded-lg w-[400px] min-h-[300px]">
          <div v-if="isFetchingCard">Loading card...</div>
          <Card
            v-else
            @close-button-clicked="router.push(`/board/${boardStore.board.id}`)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, watch } from 'vue'
import { db } from '@/firebaseInit'
import { doc, getDoc } from 'firebase/firestore'
import { useCardStore, useBoardStore } from '@/stores'
import { useRouter } from 'vue-router'
const Board = defineAsyncComponent(() => import('@/components/Board.vue'))
const Card = defineAsyncComponent(() => import('@/components/Card.vue'))
const router = useRouter()
const cardStore = useCardStore()
const boardStore = useBoardStore()
const props = defineProps(['cardId', 'boardId'])

const boardId = computed(() => props.boardId || cardStore.cardDetails.boardId)

const isFetchingBoard = ref(false)
const fetchBoardData = async (id: string) => {
  const boardRef = doc(db, 'boards_single', id)
  const boardDoc = await getDoc(boardRef)
  if (boardDoc.exists()) boardStore.hydrateBoard(boardDoc.data())
  console.log(boardStore.board)
}

const isFetchingCard = ref(false)
const fetchCard = async (id: string) => {
  const cardRef = doc(db, 'cards', id)
  const cardDoc = await getDoc(cardRef)
  if (cardDoc.exists()) cardStore.hydrateCardDetails(cardDoc.data())
  console.log(cardStore.cardDetails)
}

watch(
  () => props.cardId,
  async (newValue, oldValue) => {
    if (newValue && newValue !== cardStore?.cardDetails?.id) {
      console.log('new card id detected')
      if (Object.keys(cardStore.cardDetails).length) cardStore.clearCard()

      const matchingCard = cardStore.cards.find((card) => card.id === newValue)
      if (matchingCard) return cardStore.hydrateCardDetails(matchingCard)

      isFetchingCard.value = true
      await fetchCard(props.cardId)
      isFetchingCard.value = false
    }
  }
)

onMounted(async () => {
  isFetchingBoard.value = true

  if (props.cardId) {
    isFetchingCard.value = true
    await fetchCard(props.cardId)
  }
  await fetchBoardData(boardId.value)

  isFetchingBoard.value = false
  isFetchingCard.value = false
})
</script>

<style scoped lang="scss">
// Card {
//   min-width: 400px;
// }
</style>
