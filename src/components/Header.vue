<template>
  <header>
    <div
      v-if="route.name === 'home'"
      class="flex justify-between gap-x-2 xs:hidden"
    >
      <div v-if="!searchStore.isSearching" class="flex items-center gap-x-2">
        <div class="flex w-10 h-10">
          <button class="icon-button">
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
      <!-- <img :src="LogoMobile" class="logo-mobile" /> -->
      <div class="flex w-10 h-10 xs:hidden">
        <button @click="handleReturnToBoards" class="icon-button">
          <BackArrowIcon :color="'black'" class="w-8 h-8" />
        </button>
      </div>

      <Title
        v-if="boardStore.board?.title"
        :title="boardStore.board.title"
        @title-edited="changeBoardTitle"
        class="title"
      />

      <div class="flex w-10 h-10 relative">
        <button @click="toggleEllipsisMenu" class="icon-button">
          <img
            :src="EllipsisIcon"
            class="w-[3.7px] h-[16px] xs:w-[5px] xs:h-[20px]"
          />
        </button>

        <div v-if="isEllipsisMenuOpen">
          <div class="backdrop" @click="toggleEllipsisMenu"></div>

          <div class="ellipsis-popover">
            <button
              @click="handleDeleteBoard"
              class="p-2 w-full bg-red-200 rounded-md"
            >
              Delete Board
            </button>
            <button class="p-2 w-full bg-red-200 rounded-md">
              Change Title
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Title from '@/components/Title.vue'
import BoardSearch from '@/components/BoardSearch.vue'
import MenuIcon from '@/assets/icons/icon-menu.vue'
import BackArrowIcon from '@/assets/icons/icon-arrow-back.vue'
import EllipsisIcon from '@/assets/icons/icon-vertical-ellipsis.svg'
import { useBoardStore, useSearchStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
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
  boardStore.clearBoard()
}

const isEllipsisMenuOpen = ref(false)
const toggleEllipsisMenu = () => {
  isEllipsisMenuOpen.value = !isEllipsisMenuOpen.value
}

const handleDeleteBoard = () => {
  boardStore.deleteBoard()
  toggleEllipsisMenu()
  // TODO add toast or something similar
}
</script>

<style scoped lang="scss">
header {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: var(--header-height-mobile);
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

.icon-button {
  width: 100%;
  height: 100%;
  border-radius: 9999px; /* fully rounded */
.ellipsis-popover {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  padding: 1rem;
  justify-content: center;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.icon-button:hover,
.icon-button:active {
  background-color: var(--header-button-hover);
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}

@media (min-width: 481px) {
  header {
    height: var(--header-height-desktop);
    width: calc(100% - var(--sidebar-width));
    left: var(--sidebar-width);
    padding: 0 16px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
