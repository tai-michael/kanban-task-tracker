<template>
  <div
    v-if="!isMobileView && boardStore.boards?.length > 0"
    class="flex flex-col items-center mt-60"
  >
    <span>Select a board or create a new one.</span>
  </div>

  <div
    v-if="!boardStore.boards?.length"
    class="flex flex-col items-center mt-44 xs:mt-60"
  >
    <span>Welcome to Kanban! Get started with a board.</span>

    <button
      @click="emit('boardComposerToggled')"
      class="flex justify-center items-center mt-6 py-3 gap-x-4 w-[var(--sidebar-navbtn-width-mobile)] xs:w-[var(--sidebar-navbtn-width-desktop)] bg-[var(--main-purple)] rounded-full hover:bg-[var(--main-purple-hover)]"
    >
      <BoardIcon :color="'white'" />
      <span class="text-white font-bold">Create board</span>
    </button>
  </div>

  <BoardSelector
    v-if="isMobileView && boardStore.boards?.length > 0"
    @board-composer-triggered="emit('boardComposerToggled')"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useBoardStore } from '@/stores'
import BoardIcon from '@/assets/icons/icon-board.vue'
const boardStore = useBoardStore()

const BoardSelector = defineAsyncComponent(
  () => import('@/components/BoardSelector.vue')
)
defineProps(['isMobileView'])
const emit = defineEmits(['boardComposerToggled'])
</script>

<style scoped lang="scss">
// TODO maybe convert below to tailwind. Afterwards, redo the css of the board composer so that it doesn't look awful in desktop mode when there's no other board around. Consider hiding the sidebar when theres nothing
.hover-effect {
  background-color: var(--main-purple);
  border-radius: 100px 100px 100px 100px;

  span {
    color: white;
  }
}

.hover-effect:hover {
  background-color: var(--main-purple-hover);
}
</style>
