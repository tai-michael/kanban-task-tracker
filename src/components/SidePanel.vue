<template>
  <div
    class="side-panel flex-shrink-0 flex-grow flex max-w-[200px] min-w-[150px]"
  >
    <div v-if="fetchingBoardsFromBackend">Loading...</div>
    <div v-else>
      <div v-for="board in store.boards" :key="board.id">
        <router-link :to="`/board/${board.id}`">{{ board.title }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores'
const props = defineProps(['fetchingBoardsFromBackend'])
const store = useBoardStore()
</script>
