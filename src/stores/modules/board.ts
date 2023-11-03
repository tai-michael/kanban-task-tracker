import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useBoardStore = defineStore('board', () => {
  const router = useRouter()
  const route = useRoute()

  const board = ref({})
  const hydrateBoard = (backendData: object) => {
    board.value = backendData
  }

  return {
    board,

    hydrateBoard,
  }
})
