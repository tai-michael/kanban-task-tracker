<template>
  <main class="flex w-full h-[100vh] relative">
    <Sidebar v-if="!isMobileView" />

    <!-- NOTE might have to remove the media queries eventually if I need transition animations for mobile -->
    <div
      ref="boardContainer"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      @mousemove="dragBackground"
      class="flex-grow overflow-x-auto bg-[var(--light-gray-light-bg)] xs:transition-ml xs:duration-300"
      :class="mainContentClass"
    >
      <Header
        v-if="isMobileView || route.name === 'board' || route.name === 'card'"
      />

      <div
        v-if="route.name === 'home'"
        class="flex flex-col items-center"
        :class="{
          'items-stretch': isMobileView && boardStore.boards?.length > 0,
        }"
      >
        <div v-if="fetchingBoardsFromBackend">Loading...</div>

        <!-- TODO maybe redo the css of the board composer so that it doesn't look off-centered in desktop mode when there's no other board around. Consider hiding the sidebar when theres nothing. -->
        <BoardGreeting v-else :is-mobile-view="isMobileView" />

        <BoardSelector v-if="isMobileView && boardStore.boards?.length > 0" />
      </div>

      <router-view></router-view>
    </div>

    <ModalWrapper
      ref="boardComposerModal"
      :show-close-button="true"
      :form-classes="'flex flex-col gap-y-6 w-[85vw] max-w-[350px] h-[198.5px] xs:h-[222.5px] p-6 xs:px-8 xs:pt-8 xs:pb-10'"
    >
      <BoardComposer
    /></ModalWrapper>
  </main>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  onMounted,
  provide,
  defineAsyncComponent,
  type Ref,
} from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import useModalToggler from '@/composables/useModalToggler'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import useCardInteractionState from '@/composables/useCardInteractionState'
import useBackgroundDrag from '@/composables/useBackgroundDrag'
import { db, auth } from '@/firebaseInit'
import { doc, getDoc } from 'firebase/firestore'
import { useBoardStore } from '@/stores'
import { useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'
const Header = defineAsyncComponent(() => import('@/components/Header.vue'))
const ModalWrapper = defineAsyncComponent(
  () => import('@/components/ModalWrapper.vue')
)
const BoardGreeting = defineAsyncComponent(
  () => import('@/components/BoardGreeting.vue')
)
const BoardSelector = defineAsyncComponent(
  () => import('@/components/BoardSelector.vue')
)
const BoardComposer = defineAsyncComponent(
  () => import('@/components/BoardComposer.vue')
)
const route = useRoute()
const boardStore = useBoardStore()

const fetchingBoardsFromBackend = ref(false)
provide('fetchingBoardsFromBackend', fetchingBoardsFromBackend)
const fetchBoardsCollection = async (id: string) => {
  try {
    const boardsRef = doc(db, 'boards_grouped', id)
    const boardsDoc = await getDoc(boardsRef)
    return boardsDoc.data() ? boardsDoc.data().boards : []
  } catch (err) {
    console.error('Error fetching data:', err)
  }
}
const fetchAndHydrateBoards = async () => {
  fetchingBoardsFromBackend.value = true
  const data = await fetchBoardsCollection(auth.currentUser.uid)
  boardStore.hydrateBoards(data)
  fetchingBoardsFromBackend.value = false
}
fetchAndHydrateBoards()

const isInitialLoad = ref(true)
watch(
  () => boardStore.boards,
  () => {
    // avoids triggering watcher when board is initially fetched from backend
    if (isInitialLoad.value) {
      isInitialLoad.value = false
      return
    }
    console.log('triggered boards meta watcher')

    const updatedBoard = {
      boards: boardStore.boards,
      id: auth.currentUser.uid,
    }

    updateFirestoreDoc(
      'boards_grouped',
      auth.currentUser.uid,
      updatedBoard,
      false
    )
  },
  { deep: true }
)

const boardComposerModal = ref(null)
const { setModalRef: setBoardComposerModalRef } =
  useModalToggler('boardComposer')
onMounted(() => {
  setBoardComposerModalRef(boardComposerModal)
})

const { width } = useWindowSize()
const isMobileView = computed(() => width.value <= 480)
const isChoosingBoard = ref(false)
watch(isMobileView, (isMobile) => {
  if (!isMobile) {
    isChoosingBoard.value = false
  }
})
provide('isMobileView', isMobileView)

const isSidebarShown = useLocalStorage('is-sidebar-expanded', true)
const { isCardHeld } = useCardInteractionState()
const mainContentClass = computed(() => {
  let classes = []

  isSidebarShown.value
    ? classes.push('xs:ml-[var(--sidebar-width)]')
    : classes.push('xs:ml-0')

  if (isMobileView.value && !isCardHeld.value) {
    classes.push('snap-x', 'snap-mandatory', 'snap-always')
  }

  return classes.join(' ')
})

const boardContainer: Ref<HTMLElement | null> = ref(null)
const shouldDrag = (event) => {
  return (
    event.target === boardContainer.value ||
    event.target.classList.contains('lists-container') ||
    event.target.classList.contains('list-composer-container')
  )
}
const { startDragging, stopDragging, dragBackground } = useBackgroundDrag(
  boardContainer,
  shouldDrag
)
</script>

<style scoped lang="scss"></style>
