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
  const memoizeCard = (card: object) => {
    // not pushing activeCard, as that content is always taken from the active board, which has local rather than backend data (no need to refetch)
    cards.value.push(card)
  }
  const clearCard = () => {
    cardDetails.value = {}
  }
  const updateCardDescription = (description: string) => {
    cardDetails.value.description = description
  }
  const updateCardTitle = (title: string) => {
    cardSummary.value.title = title
  }
  const addChecklistItem = (item: object) => {
    cardDetails.value.checklist.push(item)
  }
  const updateChecklistItemName = (id: string, name: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    item.name = name
  }
  const storeUnsavedChecklistItemName = (id: string, name: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    item.unsavedName = name
  }
  const deleteUnsavedChecklistItemName = (id: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    item.unsavedName = ''
  }
  const toggleChecklistItemCompleted = (id: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    if (item) item.isCompleted = !item.isCompleted
  }

  return {
    cardSummary,
    cardDetails,
    cards,

    hydrateCardDetails,
    memoizeCard,
    clearCard,
    updateCardDescription,
    updateCardTitle,
    addChecklistItem,
    updateChecklistItemName,
    storeUnsavedChecklistItemName,
    deleteUnsavedChecklistItemName,
    toggleChecklistItemCompleted,
  }
})
