import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { db } from '@/firebaseInit'
import { writeBatch, doc } from 'firebase/firestore'
import type { Board, List, CardSummary } from '@/types'

export const useBoardStore = defineStore('board', () => {
  const router = useRouter()
  const route = useRoute()

  const boards = ref<Board[]>([])
  const board = ref<Board | null>({})
  const hydrateBoards = (backendData: Board[]) => {
    boards.value = backendData
  }
  const hydrateBoard = (backendData: Board) => {
    board.value = backendData
  }
  const updateBoardTitle = (title: string) => {
    board.value.title = title

    // updates title in side panel; necessary, as they belong in different firestore collections
    const activeBoard = boards.value.find((b) => b.id === board.value.id)
    activeBoard.title = title
  }

  const isCreatingNewBoard = ref(false)
  const toggleBoardComposer = () => {
    isCreatingNewBoard.value = !isCreatingNewBoard.value
  }
  const addList = (list: List) => {
    board.value.lists.push(list)
  }
  const removeList = async (listId: string) => {
    const listIndex = board.value.lists.findIndex((list) => list.id === listId)
    if (listIndex === -1) return

    const batch = writeBatch(db)
    const list = board.value.lists[listIndex]
    board.value.lists.splice(listIndex, 1) // or put after batch.commit()

    for (const card of list.cards) {
      const cardDocRef = doc(db, 'cards', card.id)
      batch.delete(cardDocRef)
    }

    try {
      await batch.commit()
    } catch (error) {
      console.error('Error deleting cards:', error)
    }
  }
  const updateListTitle = (id: string, title: string) => {
    const list = board.value.lists.find((list) => list.id === id)
    list.title = title
  }
  const addCard = (listId: string, card: CardSummary) => {
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
    isCreatingNewBoard,

    hydrateBoards,
    hydrateBoard,
    updateBoardTitle,
    toggleBoardComposer,
    addList,
    removeList,
    updateListTitle,
    removeCard,
    addCard,
  }
})
