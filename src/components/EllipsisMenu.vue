<template>
  <div class="flex shrink-0 w-10 h-10 relative">
    <button
      @click="toggleEllipsisMenu"
      :class="['icon-button', { 'icon-button--selected': isEllipsisMenuOpen }]"
    >
      <img
        :src="EllipsisIcon"
        class="w-[3.7px] h-[16px] xs:w-[5px] xs:h-[20px]"
      />
    </button>

    <div v-if="isEllipsisMenuOpen">
      <div class="backdrop" @click="toggleEllipsisMenu"></div>

      <div class="ellipsis-popover">
        <button @click="handleDeleteBoard">Delete Board</button>
        <button>Change Title</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EllipsisIcon from '@/assets/icons/icon-vertical-ellipsis.svg'
import { useBoardStore } from '@/stores'
const boardStore = useBoardStore()

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
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}

.ellipsis-popover {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;

  button {
    flex-grow: 1;
    padding: 1rem;
    background-color: white;
    border: none;
    &:not(:last-child) {
      border-bottom: 1px solid theme('colors.gray.300');
    }

    &:first-child {
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
    }

    &:last-child {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  }
}
</style>
