<template>
  <button
    v-if="boardStore.boards?.length > 0"
    @click="toggleModal"
    type="button"
    class="flex items-center gap-x-4 w-[var(--sidebar-navbtn-width-mobile)] xs:w-[var(--sidebar-navbtn-width-desktop)] py-3 pl-8 hover:sidebar-navbtn-hover-effect"
    :class="{
      'mt-2': boardStore.boards?.length > 9,
    }"
  >
    <BoardIcon :color="'var(--main-purple)'" />
    <span class="font-bold text-[var(--main-purple)]">+ Create new board</span>
  </button>
</template>

<script setup lang="ts">
import useModalToggler from '@/composables/useModalToggler'
import BoardIcon from '@/assets/icons/icon-board.vue'
import { useBoardStore } from '@/stores'
const boardStore = useBoardStore()
const { toggleModal } = useModalToggler('boardComposer')
</script>
