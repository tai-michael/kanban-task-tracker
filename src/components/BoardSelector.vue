<template>
  <ul
    class="pt-1.5 xs:pt-0"
    :class="{
      'board-list-short': boardStore.boards?.length <= 3,
      'board-list-long': boardStore.boards?.length > 3,
      'mobile-border': boardStore.boards?.length > 9,
    }"
  >
    <li
      v-for="board in sortedBoards"
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
          class="truncate whitespace-nowrap font-bold text-[var(--medium-gray)] max-w-[calc(var(--sidebar-navbtn-width-mobile)-80px)] xs:max-w-[calc(var(--sidebar-navbtn-width-desktop)-80px)]"
          >{{ board.title }}</span
        ></router-link
      >
    </li>
  </ul>

  <CreateBoardButton v-if="isMobileView" />
</template>

<script setup lang="ts">
import { ref, computed, inject, defineAsyncComponent } from 'vue'
import BoardIcon from '@/assets/icons/icon-board.vue'
import { useBoardStore, useCardStore, useSearchStore } from '@/stores'
import { useRoute } from 'vue-router'
const CreateBoardButton = defineAsyncComponent(
  () => import('@/components/CreateBoardButton.vue')
)
const route = useRoute()
const boardStore = useBoardStore()
const cardStore = useCardStore()
const searchStore = useSearchStore()
const emit = defineEmits(['boardLinkClicked'])
const isMobileView = inject('isMobileView')

const sortedBoards = computed(() => {
  return boardStore.boards.filter((board) =>
    board.title.toLowerCase().includes(searchStore.searchInput)
  )
})

const hoveredBoardId = ref(null)
const onMouseEnterBoardLink = (boardId: string) => {
  hoveredBoardId.value = boardId
}
const onMouseLeaveBoardLink = () => {
  hoveredBoardId.value = null
}

const checkIfBoardActive = (boardId: string) => {
  if (route.name === 'card') {
    return (
      boardId === boardStore.board?.id ||
      boardId === cardStore.cardDetails?.boardId
    )
  }
  return boardId === route.params.boardId
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
  background-color: var(--light-purple);
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
  max-height: 32.5em;
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
