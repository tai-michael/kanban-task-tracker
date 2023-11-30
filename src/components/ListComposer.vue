<template>
  <div class="min-w-[304px]">
    <div v-if="isCreatingList" ref="composer">
      <div class="input-form">
        <input
          v-model="newListTitle"
          v-focus="isCreatingList"
          @keyup.enter="processListCreation"
          @keyup.esc="hideListComposer"
          placeholder="Enter a list title"
          class="w-full"
        />
      </div>
      <div class="flex gap-x-3">
        <button @mousedown="processListCreation" class="border-2 pl-2 pr-2">
          Save
        </button>
        <button @mousedown="hideListComposer" class="border-2 pl-2 pr-2">
          X
        </button>
      </div>
    </div>

    <button
      v-else
      @click.stop="showListComposer"
      class="w-full bg-green-400 ml-2 mr-2"
    >
      + Add a new list
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import createAndAddList from '@/composables/createAndAddList'
import { useBoardStore } from '@/stores'
const isCreatingList = ref(false)
const newListTitle = ref('')
const store = useBoardStore()
const composer: Ref<HTMLElement | null> = ref(null)

const processListCreation = () => {
  if (!newListTitle.value.trim()) return
  createAndAddList(newListTitle.value)
  newListTitle.value = ''
  hideListComposer()
}

const showListComposer = () => {
  isCreatingList.value = true
}

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
  padding: 12px;
  margin: 8px 4px;
  background: rgb(212, 212, 212);
  border: black 1px solid;
  border-radius: 8px;
  min-height: 24px;
}
</style>
