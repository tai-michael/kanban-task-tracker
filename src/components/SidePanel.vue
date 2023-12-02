<template>
  <div
    class="side-panel flex-shrink-0 flex-grow flex max-w-[200px] min-w-[150px]"
  >
    <div v-if="fetchingBoardsFromBackend">Loading...</div>
    <ul v-else class="flex flex-col gap-y-[1px] p-1">
      <li v-for="board in store.boards" :key="board.id" class="p-1">
        <router-link :to="`/board/${board.id}`" class="flex w-full">{{
          board.title
        }}</router-link>
      </li>
      <button class="bg-green-400 rounded p-1 hover:bg-green-300">
        + Create new board
      </button>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores'
const props = defineProps(['fetchingBoardsFromBackend'])
const store = useBoardStore()
</script>
