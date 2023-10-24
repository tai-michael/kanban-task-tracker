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
import { ref, onMounted } from 'vue'
import { db, user, auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const boards = ref([])
const fetchingBoardsFromBackend = ref(false)
const fetchBoardsCollection = async (id: string) => {
  const boardsRef = doc(db, 'boards_grouped', id)
  const boardsDoc = await getDoc(boardsRef)
  console.log(boardsDoc.data().boards)
  return boardsDoc.data().boards
}

onMounted(async () => {
  fetchingBoardsFromBackend.value = true
  boards.value = await fetchBoardsCollection(auth.currentUser.uid)
  console.log(boards.value)
  fetchingBoardsFromBackend.value = false
  // card1.value = await fetchCard1Data(board1.value.lists[0].cards[0].id)
  // console.log(card1.value)
})
</script>
