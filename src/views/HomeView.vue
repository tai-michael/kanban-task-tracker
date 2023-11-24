<template>
  <main>DASHBOARD VIEW!</main>
  <div class="flex flex-col">
    <button @click="signOut(auth)">Sign Out</button>
    <router-link :to="`/admin`">Admin</router-link>

    <div v-if="fetchingBoardsFromBackend">Loading...</div>
    <div v-else>
      <div v-for="board in boards" :key="board.id">
        <router-link :to="`/boards/${board.id}`">{{ board.name }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { db, auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useBoardStore } from '@/stores'
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
