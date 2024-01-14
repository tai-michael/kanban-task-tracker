<template>
  <!-- <header class="mb-4 flex gap-x-2">
    <span class="font-bold uppercase" @click="router.push('/')">Kanban</span>
    <button @click="signOut(auth)">Sign Out</button>
    <router-link :to="`/admin`">Admin</router-link>
  </header> -->

  <main class="flex w-full h-[100vh]">
    <button @click="isChoosingBoard = true">Select board</button>
    <div
      class="overlay"
      v-if="isMobileView && isChoosingBoard"
      @click="isChoosingBoard = false"
    ></div>

    <Sidebar v-if="!isMobileView || isChoosingBoard" />

    <div class="flex-grow overflow-x-auto">
      <Header
        v-if="isMobileView || route.name === 'board' || route.name === 'card'"
      />

      <HomePageStatusIndicator
        v-if="route.name === 'home'"
        :fetching-boards-from-backend="fetchingBoardsFromBackend"
        :greeting-message="greetingMessage"
      />

      <router-view></router-view>
    </div>
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
const HomePageStatusIndicator = defineAsyncComponent(
  () => import('@/components/HomePageStatusIndicator.vue')
)

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const greetingMessage = computed(() => {
  const hasBoards = Object.keys(boardStore.boards).length > 0
  return hasBoards
    ? 'Click on a board or create a new one!'
    : 'Start by creating a board!'
})

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

onMounted(async () => {
  fetchingBoardsFromBackend.value = true
  const data = await fetchBoardsCollection(auth.currentUser.uid)
  boardStore.hydrateBoards(data)
  fetchingBoardsFromBackend.value = false
})

provide('fetchingBoardsFromBackend', fetchingBoardsFromBackend)

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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9000;
  transition: all 0.5s;
}

@media (min-width: 481px) {
  .overlay {
    display: none;
  }
}
</style>
