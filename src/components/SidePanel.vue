<template>
  <nav
    class="relative flex flex-col h-full w-[300px] shrink-0 border-r border-[var(--lines-light)]"
  >
    <img
      :src="LogoDark"
      class="cursor-pointer w-[150px] ml-8 mt-8 mb-14"
      @click="router.push('/')"
    />

    <div class="flex w-full">
      <div v-if="fetchingBoardsFromBackend">Loading...</div>
      <ul v-else class="flex flex-col w-full mr-6">
        <label
          v-if="store.boards.length > 0"
          class="ml-8 mb-5 text-xs font-bold uppercase tracking-[2.4px] text-[var(--medium-gray)]"
          >All boards ({{ store.boards.length }})</label
        >
        <li v-for="board in store.boards" :key="board.id" :title="board.title">
          <router-link
            :to="`/board/${board.id}`"
            class="flex items-center w-full p-3 pl-8 gap-x-4"
            :class="[
              {
                'active-board': board.id === route.params.boardId,
            <span
              class="truncate whitespace-nowrap font-bold text-[var(--medium-gray)]"
              >{{ board.title }}</span
            ></router-link
          >
        </li>
        <button
          @click.stop="store.toggleBoardComposer"
        >
          <span class="font-bold text-[var(--main-purple)]"
            >+ Create new board</span
          >
        </button>
      </ul>
    </div>

    <div v-if="store.isCreatingNewBoard" class="board-composer">
      <BoardComposer />
    </div>
  </div>

    <div class="mt-auto ml-8">
      <button class="mr-4" @click="signOut(auth)">Sign Out</button>
      <router-link :to="`/admin`">Admin</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import LogoDark from '@/assets/images/logo-dark.svg'
import { auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
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
.active-board {
  background-color: var(--main-purple);
  border-radius: 0px 100px 100px 0px;

  img {
    color: white;
  }
  span {
    color: white;
  }
}

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
