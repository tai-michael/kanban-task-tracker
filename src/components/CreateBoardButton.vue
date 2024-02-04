<template>
  <button
    v-if="boardStore.boards?.length > 0"
    @click="toggleModal"
    type="button"
    class="flex items-center gap-x-4 w-[var(--sidebar-navbtn-width-mobile)] xs:w-[var(--sidebar-navbtn-width-desktop)] py-3 pl-8 xs:mb-3 xs:mt-0 hover-effect"
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

<style scoped>
.hover-effect:hover {
  background-color: var(--light-purple);
  border-radius: 0px 100px 100px 0px;

  span {
    color: var(--main-purple);
  }
}
</style>
