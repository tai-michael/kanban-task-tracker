import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { db, auth, storage } from '@/firebaseInit'
import { writeBatch, doc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, listAll, deleteObject } from 'firebase/storage'
import type { BoardMeta, BoardDetails, List, CardSummary } from '@/types'

export const useBoardStore = defineStore('board', () => {
  const router = useRouter()
  const route = useRoute()

  const boards = ref<BoardMeta[]>([])
  const board = ref<BoardDetails | null>({})

  const isCreatingNewBoard = ref(false)
  const toggleBoardComposer = () => {
    isCreatingNewBoard.value = !isCreatingNewBoard.value
  }
  const addBoard = (board: BoardMeta) => {
    boards.value.push(board)
  }
  const clearBoard = () => {
    board.value = {}
  }

  const hydrateBoards = (backendData: BoardMeta[]) => {
    boards.value = backendData
  }
  const hydrateBoard = (backendData: BoardDetails) => {
    board.value = backendData
  }

  const updateBoardTitle = (title: string) => {
    board.value.title = title

    // updates title in side panel; necessary, as they belong in different firestore collections
    const activeBoard = boards.value.find((b) => b.id === board.value.id)
    activeBoard.title = title
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
      if (cardIndex === -1) return

      list.cards.splice(cardIndex, 1)
      break
    }
  }
  const removeBoardFromSingleBoardsCollection = () => {
    deleteDoc(doc(db, 'boards_single', board.value.id))
  }
  const removeBoardFromSidebar = () => {
    const boardIndex = boards.value.findIndex((b) => b.id === board.value.id)

    if (boardIndex === -1) return
    boards.value.splice(boardIndex, 1)
  }
  const removeCardDescriptionsFromBackend = async () => {
    const batch = writeBatch(db)

    const cardIds = board.value.lists.flatMap((list) =>
      list.cards.map((card) => card.id)
    )

    cardIds.forEach((id) => {
      const cardDocRef = doc(db, 'cards', id)
      batch.delete(cardDocRef)
    })

    try {
      await batch.commit()
    } catch (error) {
      console.error('Error deleting cards:', error)
    }
  }
  const removeCardAttachmentsFromFirebaseStorage = async () => {
    const boardFolderRef = storageRef(
      storage,
      `attachments/${auth.currentUser.uid}/${board.value.id}`
    )

    try {
      const { prefixes } = await listAll(boardFolderRef)
      for (const cardFolder of prefixes) {
        const { items } = await listAll(cardFolder)
        await Promise.all(items.map((fileRef) => deleteObject(fileRef)))
      }
    } catch (error) {
      console.error('Error deleting files from Firebase Storage:', error)
    }
  }
  const deleteBoard = () => {
    removeBoardFromSingleBoardsCollection()
    removeBoardFromSidebar()
    removeCardDescriptionsFromBackend()
    removeCardAttachmentsFromFirebaseStorage() // not from firestore
    clearBoard()
    router.replace('/')
  }

  return {
    boards,
    board,
    isCreatingNewBoard,

    addBoard,
    deleteBoard,
    hydrateBoards,
    hydrateBoard,
    clearBoard,
    updateBoardTitle,
    toggleBoardComposer,
    addList,
    removeList,
    updateListTitle,
    addCard,
    removeCard,
  }
})
