import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBoardStore } from '@/stores'

export const useCardStore = defineStore('card', () => {
  const router = useRouter()
  const route = useRoute()
  const boardStore = useBoardStore()
  const cards = ref([])

  const cardSummary = computed(() => {
    if (boardStore.board.lists) {
      for (const list of boardStore.board.lists) {
        for (const c of list.cards) {
          if (c.id === cardDetails.value.id) {
            return c
          }
        }
      }
    }

    return null
  })
  // TODO Add watcher or something to App.vue or BoardView.vue for cardStore.cardDetails and cardStore.cardSummary, where if they changed while (cardId === cardStore.activeCard.id), then update the backend for their respective firestore docs
  const cardDetails = ref({})
  const activeCard = computed(() => {
    if (!cardSummary.value) return null
    return {
      name: cardSummary.value.name,
      dueDate: cardSummary.value.due_date,
      checklistProgress: cardSummary.value.checklist_progress,
      ...cardDetails.value,
    }
  })

  const hydrateCardDetails = (cardContent: object) => {
    cardDetails.value = cardContent
  }
  const memoizeCard = () => {
    // not pushing activeCard, as that content is always taken from the active board, which has local rather than backend data (no need to refetch)
    cards.value.push(cardDetails.value)
  }
  const clearCard = () => {
    cardDetails.value = {}
  }

  return {
    activeCard,
    cardSummary,
    cardDetails,
    cards,

    hydrateCardDetails,
    memoizeCard,
    clearCard,
  }
})
