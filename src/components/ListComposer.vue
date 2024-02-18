<template>
  <div class="min-w-[304px] ml-2 mr-2 pl-2 pr-2">
    <div v-if="isCreatingList" ref="composer" class="list-composer">
      <div class="input-form">
        <input
          v-model.trim="newListTitle"
          v-focus="isCreatingList"
          @keyup.enter="processListCreation"
          @keyup.esc="hideListComposer"
          placeholder="Enter a list title"
          class="w-full"
          ref="inputRef"
        />
      </div>
      <div class="flex gap-x-3">
        <button
          @click="processListCreation"
          type="submit"
          class="pl-2 pr-2 rounded bg-blue-300 hover:bg-blue-200"
        >
          Save
        </button>
        <button
          @click="hideListComposer"
          type="button"
          class="pl-2 pr-2 rounded hover:bg-gray-200"
        >
          X
        </button>
      </div>
    </div>

    <button
      v-else
      @click.stop="showListComposer"
      type="button"
      class="w-full bg-green-400"
    >
      + Add a new list
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, inject, ref, type Ref } from 'vue'
import createAndAddList from '@/composables/createAndAddList'
const isCreatingList = ref(false)
const newListTitle = ref('')
const isMobileView = inject('isMobileView')
const inputRef = ref()
const processListCreation = async () => {
  if (!newListTitle.value) return
  createAndAddList(newListTitle.value)
  newListTitle.value = ''

  if (isMobileView.value) hideListComposer()
  else inputRef.value.focus()

  await nextTick()
  if (isMobileView.value) {
    const listsContainer = document.querySelector('.lists-container')
    const newestList =
      listsContainer.children[listsContainer.children.length - 1]
    newestList.scrollIntoView({ behavior: 'smooth' })
  } else {
    // In desktop view, the screen is wide enough such that the new list will always be in view
    const boardContainer = document.querySelector('.board-container')
    boardContainer.scrollLeft = boardContainer.scrollWidth
  }
}

const showListComposer = async () => {
  isCreatingList.value = true

  await nextTick()
  const boardContainer = document.querySelector('.board-container')
  boardContainer.scrollTo({
    left: boardContainer.scrollWidth,
    behavior: 'smooth',
  })
}

const composer: Ref<HTMLElement | null> = ref(null)
const hideListComposer = () => {
  isCreatingList.value = false
}
const handleClickOutside = (e: MouseEvent) => {
  if (composer.value && !composer.value.contains(e.target as Node))
    hideListComposer()
}
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.input-form {
  display: flex;
  background: rgb(212, 212, 212);
  border-radius: 8px;
  min-height: 24px;

  input {
    padding: 4px 8px;
    border-radius: 8px;
  }
}

.list-composer {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  background: rgb(212, 212, 212);
  border-radius: 8px;
  border: black 1px solid;
  padding: 8px;
}
</style>
