<template>
  <h2 class="text-lg font-bold select-none text-[#0a0404]">Create board</h2>

  <input
    v-model.trim="boardTitle"
    v-focus
    class="px-2 py-1.5 rounded-smh"
    placeholder="Enter a title"
  />
  <button
    @click="handleCreateBoard"
    type="submit"
    :disabled="!boardTitle"
    :class="[
      { '!bg-[#d3e5f779]': !boardTitle, 'cursor-not-allowed': !boardTitle },
    ]"
    class="modal-button bg-[#90bdfd] hover:bg-[#a5caff] active:bg-[#b3d4ff] transition-colors duration-100 ease-in-out"
  >
    Create
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
import createAndAddBoard from '@/composables/createAndAddBoard'
const router = useRouter()
const store = useBoardStore()
const boardTitle = ref('')

const handleCreateBoard = async () => {
  const boardId = await createAndAddBoard(boardTitle.value)
  router.push(`/board/${boardId}`)
}
</script>

<style scoped lang="scss"></style>
