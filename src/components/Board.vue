<template>
  <div>
    <h1>{{ board.name }}</h1>

    <div v-if="fetchingBoard">Loading board...</div>
    <div v-else class="flex">
      <div v-for="list of board.lists">
        <List :list="list"></List>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { db } from '@/firebaseInit'
import { doc, getDoc } from 'firebase/firestore'
const List = defineAsyncComponent(() => import('@/components/List.vue'))

const props = defineProps(['boardId'])
const board = ref({})
const fetchingBoard = ref(false)
const fetchBoardData = async (id: string) => {
  const boardRef = doc(db, 'boards_single', id)
  const boardDoc = await getDoc(boardRef)
  if (boardDoc.exists()) return boardDoc.data()
}

onMounted(async () => {
  fetchingBoard.value = true
  board.value = await fetchBoardData(props.boardId)
  console.log(board.value)
  fetchingBoard.value = false
})
</script>
<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1.5rem;
}
</style>
