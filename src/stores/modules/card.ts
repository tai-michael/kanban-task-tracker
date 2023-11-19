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
    // console.log(item.name)
    item.name = name
    console.log(item.name)
  }
  const storeUnsavedChecklistItemName = (id: string, name: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    // console.log(item.name)
    item.unsavedName = name
    console.log(item.unsavedName)
  }
  const deleteUnsavedChecklistItemName = (id: string) => {
    const item = cardDetails.value.checklist.find((item) => item.id === id)
    item.unsavedName = ''
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
  }
})
