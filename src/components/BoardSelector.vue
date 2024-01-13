<template>
  <div v-if="fetchingBoardsFromBackend" class="flex h-full">Loading...</div>
  <div v-else>
    <label
      v-if="boardStore.boards.length > 0"
      class="ml-8 text-xs font-bold uppercase tracking-[2.4px] text-[var(--medium-gray)]"
      >All boards ({{ boardStore.boards.length }})</label
    >

    <ul
      class="mt-5"
      :class="{
        'board-list-short': boardStore.boards.length <= 3,
        'board-list-long': boardStore.boards.length > 3,
        'mobile-border': boardStore.boards.length > 7,
      }"
    >
      <li
        v-for="board in boardStore.boards"
        :key="board.id"
        :title="board.title"
        class="w-[var(--sidebar-navbtn-width-mobile)] xs:w-[var(--sidebar-navbtn-width-desktop)]"
      >
        <router-link
          :to="`/board/${board.id}`"
          @mouseenter="onMouseEnterBoardLink(board.id)"
          @mouseleave="onMouseLeaveBoardLink"
          class="flex items-center gap-x-4 p-3 pl-8"
          :class="[
            {
              'active-board': checkIfBoardActive(board.id),
              'hover-effect': board.id !== route.params.boardId,
            },
          ]"
          @click="emit('boardLinkClicked')"
        >
          <BoardIcon :color="getBoardIconColor(board.id)" />
          <span
            class="truncate whitespace-nowrap font-bold text-[var(--medium-gray)]"
            >{{ board.title }}</span
          ></router-link
        >
      </li>
    </ul>
    <button
      @click="emit('boardComposerTriggered')"
      class="flex items-center gap-x-4 w-[var(--)] xs:w-[var(--sidebar-navbtn-width-desktop)] pt-3 pl-8 xs:pb-3 xs:mb-5 hover-effect"
    >
      <BoardIcon :color="'var(--main-purple)'" />
      <span class="font-bold text-[var(--main-purple)]"
        >+ Create new board</span
      >
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import BoardIcon from '@/assets/icons/icon-board.vue'
import { useBoardStore, useCardStore } from '@/stores'
import { useRoute } from 'vue-router'
const route = useRoute()
const boardStore = useBoardStore()
const cardStore = useCardStore()
const emit = defineEmits(['boardLinkClicked', 'boardComposerTriggered'])
const fetchingBoardsFromBackend = inject('fetchingBoardsFromBackend')

const hoveredBoardId = ref(null)
const onMouseEnterBoardLink = (boardId: string) => {
  hoveredBoardId.value = boardId
}
const onMouseLeaveBoardLink = () => {
  hoveredBoardId.value = null
}

const checkIfBoardActive = (boardId: string) =>
  boardId === route.params.boardId || boardId === cardStore.cardDetails?.boardId

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

.board-list-short,
.board-list-long {
  overflow: auto;
}
.board-list-short {
  max-height: 12em;
}
.board-list-long {
  max-height: 23em;
}
.mobile-border {
  border-bottom: 1px solid rgb(223, 223, 223);
}

@media (min-width: 481px) {
  .board-list-short,
  .board-list-long {
    max-height: unset;
    overflow: unset;
  }
  .mobile-border {
    border-bottom-width: 0px;
  }
}
</style>
