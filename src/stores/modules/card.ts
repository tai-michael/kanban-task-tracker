import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useCardStore = defineStore('card', () => {
  const router = useRouter()
  const route = useRoute()
  const isCardModalOpen = ref(false)
  // const currentCardId = ref()
  const lastBoardRoute = ref()
  // const boardId = ref('e58629a1-434f-41b5-b570-d3c2b3c2d168')

  const openCardModal = (cardId: string) => {
    isCardModalOpen.value = true
    // currentCardId.value = cardId
    lastBoardRoute.value = route.params.boardId
    console.log(lastBoardRoute.value)
    router.push(`/card/${cardId}`)
  }

  const closeCardModal = () => {
    isCardModalOpen.value = false
    // currentCardId.value = null
    router.go(-1)
  }

  // const checkRouteForCardModal = () => {
  //   if (router.currentRoute.value.path.startsWith('/card/')) {
  //     console.log()
  //     openCardModal(route.params.cardId)
  //   } else {
  //     closeCardModal()
  //   }
  // }

  return {
    isCardModalOpen,
    // currentCardId,
    lastBoardRoute,

    openCardModal,
    closeCardModal,
    // checkRouteForCardModal,
  }
})
