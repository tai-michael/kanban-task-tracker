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
  const removeChecklistItem = (id: string) => {
    const itemIndex = cardDetails.value.checklist.findIndex(
      (item) => item.id === id
    )
    if (itemIndex === -1) return
    cardDetails.value.checklist.splice(itemIndex, 1)
  }
  const updateChecklistItemName = (id: string, name: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    item.name = name
  }
  const storeUnsavedChecklistItemName = (id: string, name: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    item.unsaved_name = name
  }
  const deleteUnsavedChecklistItemName = (id: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    item.unsaved_name = ''
  }
  const toggleChecklistItemCompleted = (id: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    if (item) item.is_completed = !item.is_completed
  }
  const syncChecklistItemsCompleted = (itemsCompleted: number) => {
    cardSummary.value.checklist_items_completed = itemsCompleted
  }
  const syncChecklistItemsTotal = (itemsTotal: number) => {
    cardSummary.value.checklist_items_total = itemsTotal
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
    removeChecklistItem,
    updateChecklistItemName,
    storeUnsavedChecklistItemName,
    deleteUnsavedChecklistItemName,
    toggleChecklistItemCompleted,
    syncChecklistItemsCompleted,
    syncChecklistItemsTotal,
  }
})
