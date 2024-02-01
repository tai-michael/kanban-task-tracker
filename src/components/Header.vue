<template>
  <header>
    <div
      v-if="route.name === 'home'"
      class="flex justify-between gap-x-2 xs:hidden"
    >
      <div v-if="!searchStore.isSearching" class="flex items-center gap-x-2">
        <div class="flex w-10 h-10">
          <button type="button" class="icon-button">
            <MenuIcon :fill="'black'" class="w-7 h-7" />
          </button>
        </div>
        <span class="font-bold text-lg">Boards</span>
      </div>

      <BoardSearch v-if="boardStore.boards?.length > 0" />
    </div>

    <div
      v-else-if="route.name === 'board' || route.name === 'card'"
      class="flex w-full max-w-[100%] items-center justify-between gap-x-3"
    >
      <div class="flex shrink-0 w-10 h-10 xs:hidden">
        <button @click="handleReturnToBoards" type="button" class="icon-button">
          <BackArrowIcon :color="'black'" class="w-8 h-8" />
        </button>
      </div>

      <Title
        v-if="boardStore.board?.title"
        :title="boardStore.board.title"
        @title-edited="changeBoardTitle"
        class="title"
      />

      <EllipsisMenu v-if="Object.keys(boardStore.board).length" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import Title from '@/components/Title.vue'
import BoardSearch from '@/components/BoardSearch.vue'
import EllipsisMenu from '@/components/EllipsisMenu.vue'
import MenuIcon from '@/assets/icons/icon-menu.vue'
import BackArrowIcon from '@/assets/icons/icon-arrow-back.vue'
import { useBoardStore, useSearchStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
const isMobileView = inject('isMobileView')
const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const searchStore = useSearchStore()
const emit = defineEmits(['boardSelectorTriggered'])

const changeBoardTitle = (title: string) => {
  boardStore.updateBoardTitle(title)
}

const handleReturnToBoards = () => {
  router.push({ name: 'home' })
  if (isMobileView.value) boardStore.clearBoard()
}
</script>

<style scoped lang="scss">
header {
  position: sticky;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: var(--header-height-mobile);
  margin-bottom: 0.75rem;
  padding: 0 6px;
  background-color: white;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 700;
}

@media (min-width: 481px) {
  header {
    height: var(--header-height-desktop);
    padding: 0 16px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
