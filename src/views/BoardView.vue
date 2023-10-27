<template>
  <div>
    <h1>{{ board.name }}</h1>
    <!-- Display lists and cards here -->
    <div v-for="list of board.lists">
      <List :list="list"></List>
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

const fetchBoardData = async (id) => {
  const boardRef = doc(db, 'boards_single', id)
  const boardDoc = await getDoc(boardRef)
  if (boardDoc.exists()) return boardDoc.data()
}

onMounted(async () => {
  board.value = await fetchBoardData(props.boardId)
  console.log(board.value)
})

// Additional logic to fetch lists and cards for this board...
</script>
<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1.5rem;
}
</style>
