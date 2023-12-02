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
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { db, auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useBoardStore } from '@/stores'
import { useRouter } from 'vue-router'
import SidePanel from '@/components/SidePanel.vue'
const router = useRouter()
const store = useBoardStore()
const isInitialLoad = ref(true)
const fetchingBoardsFromBackend = ref(false)
const fetchBoardsCollection = async (id: string) => {
  const boardsRef = doc(db, 'boards_grouped', id)
  const boardsDoc = await getDoc(boardsRef)
  console.log(boardsDoc.data().boards)
  return boardsDoc.data().boards
}

watch(
  () => store.boards,
  () => {
    // avoids triggering watcher when board is initially fetched from backend
    if (isInitialLoad.value) {
      isInitialLoad.value = false
      return
    }
    console.log('triggered boards watcher')

    // NOTE opting not to use the updateFirestoreDoc composable, as that one debounces by default, which cancels out
    const docRef = doc(db, 'boards_grouped', auth.currentUser.uid)
    const updatedBoard = {
      boards: store.boards,
      id: auth.currentUser.uid,
    }
    setDoc(docRef, updatedBoard)
  },
  { deep: true }
)

onMounted(async () => {
  fetchingBoardsFromBackend.value = true
  const data = await fetchBoardsCollection(auth.currentUser.uid)
  store.hydrateBoards(data)
  fetchingBoardsFromBackend.value = false
})
</script>
