<template>
  <div class="min-w-[304px]">
    <div v-if="isCreatingList">
      <div class="input-form">
        <input
          v-model="newListTitle"
          v-focus="isCreatingList"
          @blur="processListCreation"
          @keyup.enter="processListCreation"
          @keyup.esc="resetListCreationState"
          placeholder="Enter a list title"
          class="w-full"
        />
      </div>
      <div class="flex gap-x-3">
        <button
          :disabled="!newListTitle"
          @mousedown="processListCreation"
          class="border-2 pl-2 pr-2"
        >
          Save
        </button>
        <button @mousedown="resetListCreationState" class="border-2 pl-2 pr-2">
          X
        </button>
      </div>
    </div>

    <button
      v-else
      @click.stop="isCreatingList = true"
      class="w-full bg-green-400 ml-2 mr-2"
    >
      + Add a new list
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import createAndAddList from '@/composables/createAndAddList'
import { useBoardStore } from '@/stores'
const isCreatingList = ref(false)
const newListTitle = ref('')
const store = useBoardStore()

const processListCreation = () => {
  if (newListTitle.value) createAndAddList(newListTitle.value)
  resetListCreationState()
}

const resetListCreationState = () => {
  newListTitle.value = ''
  isCreatingList.value = false
}
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
