<template>
  <h2 class="text-lg font-bold select-none text-[#0a0404] dark:text-[white]">
    Create board
  </h2>

  <input
    v-model.trim="boardTitle"
    v-focus
    class="px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-[var(--main-purple)]"
    placeholder="Enter a title"
  />
  <button
    @click="handleCreateBoard"
    type="submit"
    :disabled="!boardTitle"
    class="modal-button text-white font-semibold bg-[var(--main-purple)] hover:bg-[var(--main-purple-hover)] active:bg-[var(--main-purple--hover)] transition-colors duration-100 ease-in-out"
    :class="{
      '!text-[var(--main-purple-hover)] !bg-[var(--main-purple-transparent)] cursor-not-allowed':
        !boardTitle,
    }"
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
