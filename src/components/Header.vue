<template>
  <header>
    <div
      v-if="route.name === 'home'"
      class="flex justify-between gap-x-2 xs:hidden"
    >
      <!-- <img
        :src="LogoDark"
        class="logo-desktop cursor-pointer w-[120px]"
        @click="router.push('/')"
      /> -->
      <div v-if="!searchStore.isSearching" class="flex items-center gap-x-2">
        <div class="flex w-10 h-10">
          <button class="icon-button">
            <MenuIcon :fill="'black'" class="w-7 h-7" />
          </button>
        </div>
        <span class="font-bold text-lg">Boards</span>
      </div>

      <BoardSearch />
    </div>

    <div
      v-else-if="route.name === 'board' || route.name === 'card'"
      class="flex w-full max-w-[100%] items-center justify-between gap-x-3"
    >
      <!-- <img :src="LogoMobile" class="logo-mobile" /> -->
      <div class="flex w-10 h-10 xs:hidden">
        <button @click="router.push({ name: 'home' })" class="icon-button">
          <BackArrowIcon :color="'black'" class="w-8 h-8" />
        </button>
      </div>

      <Title
        v-if="boardStore.board?.title"
        :title="boardStore.board.title"
        @title-edited="changeBoardTitle"
        class="title"
      />
      <!-- <button @click="emit('boardSelectorTriggered')" class="p-3">
          <img :src="DownArrow" />
        </button> -->

      <div class="flex w-10 h-10">
        <button @clicked="emit('ellipsisMenuTriggered')" class="icon-button">
          <img
            :src="EllipsisIcon"
            class="w-[3.7px] h-[16px] xs:w-[5px] xs:h-[20px]"
          />
        </button>
      </div>

      <!-- TODO add popup for delete board -->
      <!-- <button @click="handleDeleteBoard" class="p-1 bg-red-200">
        Delete Board
      </button> -->
    </div>
  </header>
</template>

<script setup lang="ts">
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
const emit = defineEmits(['boardSelectorTriggered', 'ellipsisMenuTriggered'])

const changeBoardTitle = (title: string) => {
  boardStore.updateBoardTitle(title)
}
}

const handleDeleteBoard = () => {
  store.deleteBoard()
  // TODO add toast or something similar
}

const emit = defineEmits(['boardSelectorTriggered'])
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
}

.icon-button:hover,
.icon-button:active {
  background-color: var(--header-button-hover);
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
