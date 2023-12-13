<template>
  <div ref="composer" class="flex flex-col bg-gray-200 w-full h-full p-3">
    <header>
      <h2>Create board</h2>
      <button @click="store.toggleBoardComposer">X</button>
    </header>

    <input
      v-model="boardTitle"
      v-focus
      class="px-2 py-1.5 mb-6 rounded-sm"
      placeholder="Enter a title"
    />
    <button
      @click="handleCreateBoard"
      :disabled="!boardTitle"
      :class="{ '!bg-gray-300': !boardTitle }"
      class="bg-blue-300 hover:bg-blue-200 rounded p-1"
    >
      Create
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useBoardStore } from '@/stores'
import createAndAddBoard from '@/composables/createAndAddBoard'
const store = useBoardStore()
const boardTitle = ref('')
const composer: Ref<HTMLElement | null> = ref(null)

const handleCreateBoard = () => {
  createAndAddBoard(boardTitle.value)
  store.toggleBoardComposer()
  // TODO possibly navigate to the board right after
}
const handleClickOutside = (e: MouseEvent) => {
  if (composer.value && !composer.value.contains(e.target as Node))
    store.toggleBoardComposer()
}
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
header {
  padding: 4px 8px;
  position: relative;
  text-align: center;
  display: grid;
  align-items: center;
  grid-template-columns: 32px 1fr 32px;
  margin-bottom: 4px;

  h2 {
    color: #44546f;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.003em;
    line-height: 40px;
    display: block;
    position: relative;
    height: 40px;
    margin: 0;
    overflow: hidden;
    padding: 0 32px;
    text-overflow: ellipsis;
    white-space: nowrap;
    grid-column: 1 / span 3;
    grid-row: 1;
  }

  button {
    z-index: 2;
    grid-column: 3;
    grid-row: 1;
    color: #626f86;
    border-radius: 8px;
    display: flex;
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  button:hover {
    background-color: rgb(247, 247, 247);
  }
}
</style>
