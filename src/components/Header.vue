<template>
  <div class="bg-gray-300 mb-4 p-4">
    <div
      v-if="$route.name === 'board' || $route.name === 'card'"
      class="flex justify-between"
    >
      <Title
        v-if="store.board.title"
        :title="store.board.title"
        @title-edited="changeBoardTitle"
      />
      <button @click="handleDeleteBoard" class="p-1 mr-2 bg-red-200">
        Delete Board
      </button>
    </div>
    <div v-else class="flex justify-between">
      <img
        :src="LogoDark"
        class="logo cursor-pointer w-[120px]"
        @click="router.push('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Title from '@/components/Title.vue'
import LogoDark from '@/assets/images/logo-dark.svg'
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
</script>

<style scoped lang="scss"></style>
