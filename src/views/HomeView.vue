<template>
  <main class="flex w-full h-[100vh] relative">
    <Sidebar
      v-if="!isMobileView"
      @board-composer-triggered="toggleBoardComposer"
    />

    <div class="flex-grow overflow-x-auto bg-[var(--light-gray-light-bg)]">
      <div
        v-if="isMobileView || route.name === 'board' || route.name === 'card'"
        class="header-container"
      >
        <Header @board-selector-triggered="toggleBoardSelector" />
      </div>

      <div
        v-if="route.name === 'home'"
        class="flex flex-col items-center"
        :class="{
          'items-stretch pt-3': isMobileView && boardStore.boards?.length > 0,
        }"
      >
        <div v-if="fetchingBoardsFromBackend">Loading...</div>

        <HomePageGreeting
          v-else
          :is-mobile-view="isMobileView"
          @board-composer-toggled="toggleBoardComposer"
        />
      </div>

      <router-view></router-view>
    </div>

    <ModalWrapper
      ref="sideBarModal"
      :show-close-button="true"
      :classes="'w-[264px] min-h-[250px] max-h-[518px]'"
      ><Sidebar
        @board-link-clicked="toggleBoardSelector"
        @board-composer-triggered="toggleBoardComposer"
    /></ModalWrapper>

    <ModalWrapper
      ref="boardComposerModal"
      :show-close-button="true"
      :classes="'w-[300px]'"
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
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import { useBoardStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
const Header = defineAsyncComponent(() => import('@/components/Header.vue'))
const ModalWrapper = defineAsyncComponent(
  () => import('@/components/ModalWrapper.vue')
)
const HomePageGreeting = defineAsyncComponent(
  () => import('@/components/HomePageGreeting.vue')
)
const BoardComposer = defineAsyncComponent(
  () => import('@/components/BoardComposer.vue')
)
const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()

const boardComposerModal = ref<InstanceType<typeof ModalWrapper>>()
const toggleBoardComposer = () => {
  if (sideBarModal.value?.visible) sideBarModal.value?.close()
  boardComposerModal.value?.showModal()
}

const sideBarModal = ref<InstanceType<typeof ModalWrapper>>()
const toggleBoardSelector = () => {
  if (sideBarModal.value?.visible) sideBarModal.value?.close()
  else sideBarModal.value?.showModal()
}

const isInitialLoad = ref(true)
const fetchingBoardsFromBackend = ref(false)
const fetchBoardsCollection = async (id: string) => {
  try {
    const boardsRef = doc(db, 'boards_grouped', id)
    const boardsDoc = await getDoc(boardsRef)
    return boardsDoc.data() ? boardsDoc.data().boards : []
  } catch (err) {
    console.error('Error fetching data:', err)
  }
}

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

provide('fetchingBoardsFromBackend', fetchingBoardsFromBackend)
onMounted(async () => {
  fetchingBoardsFromBackend.value = true
  const data = await fetchBoardsCollection(auth.currentUser.uid)
  boardStore.hydrateBoards(data)
  fetchingBoardsFromBackend.value = false
})

const isChoosingBoard = ref(false)
const { width } = useWindowSize()
const isMobileView = computed(() => width.value <= 480)
watch(isMobileView, (isMobile) => {
  if (!isMobile) {
    isChoosingBoard.value = false
  }
})
</script>

<style scoped lang="scss">
.header-container {
  margin-bottom: 5rem;
  margin-bottom: calc(var(--header-height-mobile) + 1rem);

  @media (min-width: 481px) {
    margin-bottom: calc(var(--header-height-desktop) + 2rem);
  }
}
</style>
