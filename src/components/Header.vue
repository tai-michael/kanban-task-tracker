<template>
  <header class="h-24 bg-white flex flex-col justify-center pl-6 pr-6 w-full">
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
      class="flex w-full max-w-[100%] items-center justify-between gap-x-4"
    >
        <!-- TODO remove this and down arrow below-->
        <!-- <img :src="LogoMobile" class="logo-mobile" /> -->
        <span @click="router.push({ name: 'home' })" class="xs:hidden">⬅</span>
        <Title
          v-if="store.board.title"
          :title="store.board.title"
          @title-edited="changeBoardTitle"
          class="title"
        />
        <!-- <button @click="emit('boardSelectorTriggered')" class="p-3">
          <img :src="DownArrow" />
        </button> -->

      <!-- TODO add ellipsis and ellipsis menu and relocate delete button to it -->
      <button @click="handleDeleteBoard" class="p-1 mr-2 bg-red-200">
        Delete Board
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import Title from '@/components/Title.vue'
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
  height: var(--header-height-mobile);
  padding: 0 16px;
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
    width: calc(100% - var(--sidebar-width));
    left: var(--sidebar-width);
    padding: 0 24px;
  }

  .title {
    font-size: 24px;
  }

  // .logo-mobile {
  //   display: none;
  // }
}
</style>
