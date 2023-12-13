import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBoardStore } from '@/stores'
import type { CardDescription, ChecklistItem } from '@/types'

export const useCardStore = defineStore('card', () => {
  // const router = useRouter()
  // const route = useRoute()
  const boardStore = useBoardStore()
  const memoizedCards = ref<CardDescription[]>([])
  const cardDetails = ref<CardDescription | null>({})
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

  const hydrateCardDetails = (cardContent: CardDescription) => {
    cardDetails.value = cardContent
  }
  const memoizeCard = (card: CardDescription) => {
    // not pushing activeCard, as that content is always taken from the active board, which has local rather than backend data (no need to refetch)
    memoizedCards.value.push(card)
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
  const updateCardDueDate = (date: Date) => {
    cardSummary.value.due_date = date
  }
  const toggleCardCompleted = (id: string) => {
    for (const list of boardStore.board.lists) {
      const card = list.cards.find((c) => c.id === id)
      if (card) {
        card.is_completed = !card.is_completed
        break
      }
    }
  }
  const addChecklistItem = (item: ChecklistItem) => {
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
  const updateChecklistProgress = (
    itemsCompleted: number,
    itemsTotal: number
  ) => {
    cardSummary.value.checklist_progress = `${itemsCompleted}/${itemsTotal}`
  }

  return {
    cardSummary,
    cardDetails,
    memoizedCards,

    hydrateCardDetails,
    memoizeCard,
    clearCard,
    updateCardDescription,
    updateCardTitle,
    updateCardDueDate,
    toggleCardCompleted,
    addChecklistItem,
    updateChecklistItemName,
    storeUnsavedChecklistItemName,
    deleteUnsavedChecklistItemName,
    toggleChecklistItemCompleted,
    updateChecklistProgress,
  }
})
