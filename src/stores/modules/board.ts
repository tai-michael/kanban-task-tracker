import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useBoardStore = defineStore('board', () => {
  const router = useRouter()
  const route = useRoute()

  const boards = ref([])
  const board = ref({})
  const hydrateBoards = (backendData) => {
    boards.value = backendData
  }
  const hydrateBoard = (backendData: object) => {
    board.value = backendData
  }
  const updateBoardTitle = (title: string) => {
    board.value.title = title

    // updates title in side panel; necessary, as they belong in different firestore collections
    const activeBoard = boards.value.find((b) => b.id === board.value.id)
    activeBoard.title = title
  }
  const updateListTitle = (id: string, title: string) => {
    const list = board.value.lists.find((list) => list.id === id)
    list.title = title
  }
  const addCard = (listId: string, card: object) => {
    const list = board.value.lists.find((l) => l.id === listId)
    list.cards.push(card)
  }
  const removeCard = (cardId: string) => {
    for (const list of board.value.lists) {
      const cardIndex = list.cards.findIndex((c) => c.id === cardId)

      if (cardIndex !== -1) {
        list.cards.splice(cardIndex, 1)
        break
      }
    }
  }

  return {
    boards,
    board,

    removeCard,
    addCard,
    hydrateBoards,
    hydrateBoard,
    updateBoardTitle,
    updateListTitle,
  }
})
