<template>
  <div ref="composer" class="flex flex-col bg-gray-200 h-full p-3">
    <h2 class="pt-1 pb-4 text-center">Create board</h2>

    <input
      v-model.trim="boardTitle"
      v-focus
      class="px-2 py-1.5 mb-6 rounded-sm"
      placeholder="Enter a title"
    />
    <button
      @click="handleCreateBoard"
      type="button"
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
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
import createAndAddBoard from '@/composables/createAndAddBoard'
const router = useRouter()
const store = useBoardStore()
const boardTitle = ref('')
const composer: Ref<HTMLElement | null> = ref(null)

const handleCreateBoard = async () => {
  const boardId = await createAndAddBoard(boardTitle.value)
  router.push(`/board/${boardId}`)
  store.toggleBoardComposer()
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
