<template>
  <main class="flex w-full h-[100vh] relative">
    <Sidebar
      v-if="!isMobileView"
      @board-composer-triggered="toggleBoardComposer"
    />

    <div
      class="flex-grow overflow-x-auto bg-[var(--light-gray-light-bg)] xs:pl-[var(--sidebar-width)] xs:transition-pl xs:duration-300"
      :class="{ 'xs:pl-0': !isSidebarExpanded }"
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

        <!-- TODO maybe convert below to tailwind. Afterwards, redo the css of the board composer so that it doesn't look off-centered in desktop mode when there's no other board around. Consider hiding the sidebar when theres nothing. -->
        <BoardGreeting
          v-else
          :is-mobile-view="isMobileView"
          @board-composer-triggered="toggleBoardComposer"
        />

        <BoardSelector
          v-if="isMobileView && boardStore.boards?.length > 0"
          @board-composer-triggered="toggleBoardComposer"
        />
      </div>

      <router-view></router-view>
    </div>

    <ModalWrapper
      ref="boardComposerModal"
      :show-close-button="true"
      :classes="'w-[280px] xs:w-[300px]'"
    >
      <BoardComposer
    /></ModalWrapper>
  </main>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  watch,
  computed,
  defineAsyncComponent,
  provide,
} from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { db, auth } from '@/firebaseInit'
import { doc, getDoc } from 'firebase/firestore'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
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
const isSidebarExpanded = useLocalStorage('is-sidebar-expanded', true)

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
onMounted(async () => {
  fetchingBoardsFromBackend.value = true
  const data = await fetchBoardsCollection(auth.currentUser.uid)
  boardStore.hydrateBoards(data)
  fetchingBoardsFromBackend.value = false
})

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

const boardComposerModal = ref<InstanceType<typeof ModalWrapper>>()
const toggleBoardComposer = () => {
  boardComposerModal.value?.showModal()
}

const { width } = useWindowSize()
const isMobileView = computed(() => width.value <= 480)
const isChoosingBoard = ref(false)
watch(isMobileView, (isMobile) => {
  if (!isMobile) {
    isChoosingBoard.value = false
  }
})
provide('isMobileView', isMobileView)
</script>

<style scoped lang="scss"></style>
