<template>
  <div
    v-if="fetchingError"
    class="flex justify-center items-center text-center mt-44 xs:mt-60 leading-8 text-[var(--medium-dark-gray)] font-semibold"
  >
    Error fetching data.<br />
    Please try refreshing the page.
  </div>

  <div
    v-else-if="!boardStore.boards?.length"
    class="flex flex-col items-center mt-44 xs:mt-60"
  >
    <div
      class="text-center mb-2 leading-8 text-[var(--medium-dark-gray)] font-semibold"
    >
      Welcome to Kanban!<br />
      Get started with a board.
    </div>

    <button
      @click="toggleModal"
      type="button"
      class="flex justify-center items-center mt-6 py-3 gap-x-4 w-[var(--sidebar-navbtn-width-mobile)] xs:w-[var(--sidebar-navbtn-width-desktop)] bg-[var(--main-purple)] rounded-full hover:bg-[var(--main-purple-hover)]"
    >
      <BoardIcon :color="'white'" />
      <span class="text-white font-bold">Create board</span>
    </button>
  </div>

  <div v-else-if="!isMobileView" class="flex flex-col items-center mt-60">
    <span class="font-semibold text-[var(--medium-dark-gray)]"
      >Select a board or create a new one.</span
    >
  </div>
</template>

<script setup lang="ts">
import useModalToggler from '@/composables/useModalToggler'
import { useBoardStore } from '@/stores'
import BoardIcon from '@/assets/icons/icon-board.vue'
const boardStore = useBoardStore()
defineProps(['isMobileView', 'fetchingError'])
const { toggleModal } = useModalToggler('boardComposer')
</script>
