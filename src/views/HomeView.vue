<template>
  <header class="mb-4 flex gap-x-2">
    <span class="font-bold uppercase" @click="router.push('/')">Kanban</span>
    <button @click="signOut(auth)">Sign Out</button>
    <router-link :to="`/admin`">Admin</router-link>
  </header>

  <main class="flex w-full h-[95vh]">
    <SidePanel :fetching-boards-from-backend="fetchingBoardsFromBackend" />
    <div class="flex-grow overflow-x-auto">
      <router-view></router-view>
      <div
        v-if="route.name === 'home'"
        class="flex justify-center items-center mt-5"
      >
        {{ greetingMessage }}
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import { db, auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import { useBoardStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
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
    console.log(boardsDoc.data().boards)
    return boardsDoc.data().boards
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
</script>
