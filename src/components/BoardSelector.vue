<template>
  <div class="board-selection flex w-full pr-6">
    <div v-if="fetchingBoardsFromBackend">Loading...</div>
    <div v-else class="w-full">
      <label
        v-if="store.boards.length > 0"
        class="ml-8 text-xs font-bold uppercase tracking-[2.4px] text-[var(--medium-gray)]"
        >All boards ({{ store.boards.length }})</label
      >
      <ul class="board-list mt-5 flex flex-col">
        <li v-for="board in store.boards" :key="board.id" :title="board.title">
          <!-- TODO add click handler for closing modal -->
          <router-link
            :to="`/board/${board.id}`"
            @mouseenter="onMouseEnterBoardLink(board.id)"
            @mouseleave="onMouseLeaveBoardLink"
            class="flex items-center w-full p-3 pl-8 gap-x-4"
            :class="[
              {
                'active-board': board.id === route.params.boardId,
                'hover-effect': board.id !== route.params.boardId,
              },
            ]"
          >
            <BoardIcon :color="getBoardIconColor(board.id)" />
            <span
              class="truncate whitespace-nowrap font-bold text-[var(--medium-gray)]"
              >{{ board.title }}</span
            ></router-link
          >
        </li>
        <button
          @click.stop="store.toggleBoardComposer"
          class="flex items-center w-full p-3 pl-8 gap-x-4 hover-effect"
        >
          <BoardIcon :color="'var(--main-purple)'" />
          <span class="font-bold text-[var(--main-purple)]"
            >+ Create new board</span
          >
        </button>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import BoardIcon from '@/assets/icons/icon-board.vue'
import { useBoardStore } from '@/stores'
import { useRoute } from 'vue-router'
const route = useRoute()
const store = useBoardStore()

const fetchingBoardsFromBackend = inject('fetchingBoardsFromBackend')

const hoveredBoardId = ref(null)
const onMouseEnterBoardLink = (boardId: string) => {
  hoveredBoardId.value = boardId
}
const onMouseLeaveBoardLink = () => {
  hoveredBoardId.value = null
}
const getBoardIconColor = (boardId: string) => {
  if (boardId === route.params.boardId) {
    return 'white' // Active board color
  } else if (boardId === hoveredBoardId.value) {
    return 'var(--main-purple)' // Hover color
  }
  return 'var(--medium-gray)' // Default color
}
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

.hover-effect:hover {
  background-color: var(--light-nav-hover);
  border-radius: 0px 100px 100px 0px;

  span {
    color: var(--main-purple);
  }
}

.board-selection {
  margin-top: 1rem;
}

.board-list {
  max-height: 12em;
  overflow: scroll;
}

@media (min-width: 481px) {
  .board-selection {
    margin-top: 0;
  }

  .board-list {
    max-height: unset;
    overflow: unset;
  }
}
</style>
