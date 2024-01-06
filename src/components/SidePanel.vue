<template>
  <div class="relative">
    <div
      class="side-panel flex-shrink-0 flex-grow flex max-w-[200px] min-w-[150px]"
    >
  <nav>
    <header class="mb-4 flex gap-x-2">
      <span class="font-bold uppercase cursor-pointer" @click="router.push('/')"
        >Kanban</span
      >
      <button @click="signOut(auth)">Sign Out</button>
      <router-link :to="`/admin`">Admin</router-link>
    </header>
    <img
      :src="LogoDark"
      class="cursor-pointer w-[150px] ml-8 mt-8 mb-14"
      @click="router.push('/')"
    />

    <div class="flex w-full">
      <div v-if="fetchingBoardsFromBackend">Loading...</div>
      <ul v-else class="flex flex-col gap-y-[1px] p-1">
        <li v-for="board in store.boards" :key="board.id" class="p-1">
          <router-link :to="`/board/${board.id}`" class="flex w-full">{{
            board.title
          }}</router-link>
        </li>
        <button
          @click.stop="store.toggleBoardComposer"
          class="bg-green-400 rounded p-1 hover:bg-green-300"
        >
          + Create new board
        </button>
      </ul>
    </div>

    <div v-if="store.isCreatingNewBoard" class="board-composer">
      <BoardComposer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import LogoDark from '@/assets/images/logo-dark.svg'
import { auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { useBoardStore } from '@/stores'
const BoardComposer = defineAsyncComponent(
  () => import('@/components/BoardComposer.vue')
)
defineProps(['fetchingBoardsFromBackend'])
const store = useBoardStore()
</script>

<style scoped lang="scss">
.board-composer {
  z-index: 1;
  position: absolute;
  top: 0; // Align top with SidePanel
  left: 100%; // Position to the right of SidePanel
  width: 300px;
  height: 180px;
  background-color: white; // Optional, for visibility
  border: 1px solid #ccc; // Optional, for visibility
  border-radius: 8px;
}
</style>
