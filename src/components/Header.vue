<template>
  <header>
    <div v-if="$route.name === 'home'" class="flex justify-between">
      <!-- <img
        :src="LogoDark"
        class="logo-desktop cursor-pointer w-[120px]"
        @click="router.push('/')"
      /> -->
      <div>(menu) <span class="font-bold text-lg">Boards</span></div>
      🔍
    </div>

    <div
      v-else-if="$route.name === 'board' || $route.name === 'card'"
      class="flex w-full max-w-[100%] items-center justify-between gap-x-3"
    >
      <!-- <img :src="LogoMobile" class="logo-mobile" /> -->
      <button
        @click="router.push({ name: 'home' })"
        class="p-1 xs:hidden rounded-full flex items-center justify-center hover:bg-[var(--placeholder-button-hover)] active:bg-[var(--placeholder-button-hover)]"
      >
        <BackArrow :color="'black'" class="w-8 h-8" />
      </button>

      <Title
        v-if="store.board.title"
        :title="store.board.title"
        @title-edited="changeBoardTitle"
        class="title"
      />
      <!-- <button @click="emit('boardSelectorTriggered')" class="p-3">
          <img :src="DownArrow" />
        </button> -->

      <button class="p-3 min-w-[29px]">
        class="py-3 px-[1.2rem] min-w-[29px] rounded-full flex items-center justify-center hover:bg-[var(--placeholder-button-hover)] active:bg-[var(--placeholder-button-hover)]"
        <img :src="Ellipsis" class="ellipsis-btn" />
      </button>

      <!-- TODO add popup for delete board -->
      <!-- <button @click="handleDeleteBoard" class="p-1 bg-red-200">
        Delete Board
      </button> -->
    </div>
  </header>
</template>

<script setup lang="ts">
import Title from '@/components/Title.vue'
import BackArrow from '@/assets/icons/icon-arrow-back.vue'
import Ellipsis from '@/assets/icons/icon-vertical-ellipsis.svg'
import { useBoardStore } from '@/stores'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useBoardStore()
const changeBoardTitle = (title: string) => {
  store.updateBoardTitle(title)
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
  padding: 0 4px;
  background-color: white;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 700;
}

.ellipsis-btn {
  display: block;
  width: 3.7px;
  height: 16px;
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

  .ellipsis-btn {
    width: 5px;
    height: 20px;
  }
}
</style>
