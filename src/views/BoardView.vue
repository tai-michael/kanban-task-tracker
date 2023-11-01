<template>
  <div>
    <Board
      v-if="props.boardId || store.lastBoardRoute || card.boardId"
      :boardId="boardId"
    />

    <transition name="fade">
      <div
        v-if="cardId"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      >
        <CardContent v-if="card" :card="card" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { db } from '@/firebaseInit'
import { doc, getDoc } from 'firebase/firestore'
import { useCardStore } from '@/stores'
import { useRoute } from 'vue-router'
const route = useRoute()
const store = useCardStore()
const Board = defineAsyncComponent(() => import('@/components/Board.vue'))
const CardContent = defineAsyncComponent(
  () => import('@/components/CardContent.vue')
)
const props = defineProps(['cardId', 'boardId'])

const boardId = computed(
  () => props.boardId || store.lastBoardRoute || card.value.boardId
)

const card = ref({})
const fetchingCardFromBackend = ref(false)
const fetchCard = async (id: string) => {
  const cardRef = doc(db, 'cards', id)
  const cardDoc = await getDoc(cardRef)
  console.log(cardDoc?.data()?.card)
  if (cardDoc.exists()) return cardDoc.data()
}

onMounted(async () => {
  if (route.params.cardId) {
    fetchingCardFromBackend.value = true
    card.value = await fetchCard(props.cardId)
    console.log(card.value)
    fetchingCardFromBackend.value = false
  } else if (route.params.boardId) {
  }
})
</script>
