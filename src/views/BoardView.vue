<template>
  <div>
    <div v-if="isFetchingBoard">Loading board...</div>
    <Board v-if="boardStore.board" />
    <!-- REVIEW could pass 'fetching' variables as props into their respective components and render spinners there; not sure which is the more reusable approach -->

    <transition name="fade">
      <div
        v-show="cardId"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      >
        <CardContent
          v-show="cardStore.card"
          @close-button-clicked="router.push(`/board/${boardStore.board.id}`)"
          :isFetchingCard="isFetchingCard"
        />
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
const CardContent = defineAsyncComponent(
  () => import('@/components/CardContent.vue')
)
const router = useRouter()
const cardStore = useCardStore()
const boardStore = useBoardStore()
const props = defineProps(['cardId', 'boardId'])

const boardId = computed(() => props.boardId || cardStore.card.boardId)

const isFetchingBoard = ref(false)
const fetchBoardData = async (id: string) => {
  const boardRef = doc(db, 'boards_single', id)
  const boardDoc = await getDoc(boardRef)
  if (boardDoc.exists()) boardStore.hydrateBoard(boardDoc.data())
  console.log(boardStore.board)
}

const card = ref({})
const isFetchingCard = ref(false)
const fetchCard = async (id: string) => {
  const cardRef = doc(db, 'cards', id)
  const cardDoc = await getDoc(cardRef)
  if (cardDoc.exists()) cardStore.hydrateCard(cardDoc.data())
  console.log(cardStore.card)
}

watch(
  () => props.cardId,
  async (newValue, oldValue) => {
    if (newValue && newValue !== cardStore.card.id) {
      console.log('new card id detected')
      if (Object.keys(cardStore.card).length) cardStore.clearCard()
      isFetchingCard.value = true
      await fetchCard(props.cardId)
      isFetchingCard.value = false
    }
  }
)

onMounted(async () => {
  console.log('Board View mounted')
  if (props.cardId) {
    isFetchingCard.value = true
    await fetchCard(props.cardId)
    isFetchingCard.value = false
  }

  isFetchingBoard.value = true
  await fetchBoardData(boardId.value)
  isFetchingBoard.value = false
})
</script>
