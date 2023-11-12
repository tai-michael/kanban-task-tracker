import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBoardStore } from '@/stores'

export const useCardStore = defineStore('card', () => {
  // const router = useRouter()
  // const route = useRoute()
  const boardStore = useBoardStore()
  const cards = ref([])
  const cardDetails = ref({})
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
    cardSummary,
    cardDetails,
    cards,

    hydrateCardDetails,
    memoizeCard,
    clearCard,
  }
})
