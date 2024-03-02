<template>
  <input
    type="checkbox"
    @click.stop="store.toggleChecklistItemCompleted(item.id)"
    :checked="item.is_completed"
  />

  <div class="flex justify-between gap-x-2 w-full">
    <div v-if="item.id === activeItemId" class="flex flex-col gap-x-3 w-full">
      <input
        class="flex"
        v-model.trim="activeItemName"
        v-focus="item.id === activeItemId"
        @blur="storeUnsavedItemName(item.name)"
        @keyup.enter="saveItemName(item.name)"
        @keyup.esc="clearItemEdit(item.id, item.name)"
      />
      <!-- NOTE 'mousedown' needed, as 'blur' triggers before 'click', meaning the button wouldn't exist in DOM, so its click would never trigger -->
      <div class="flex justify-between">
        <div>
          <button
            @mousedown="saveItemName(item.name)"
            type="submit"
            class="mr-3"
          >
            Save
          </button>
          <button @mousedown="clearItemEdit(item.id, item.name)" type="button">
            X
          </button>
        </div>
        <button @mousedown="store.removeChecklistItem(item.id)" type="button">
          Delete
        </button>
      </div>
    </div>

    <span
      v-else
      @click.stop="beginItemNameEdit(item)"
      :class="{ 'line-through': item.is_completed }"
    >
      {{ item.name }}
    </span>

    <div
      v-if="item.id !== activeItemId && item.unsaved_name"
      class="flex gap-x-3"
    >
      <span>You have unsaved edits.</span>
      <button @click="beginItemNameEdit(item)" type="button" class="underline">
        View edits
      </button>
      <button
        @click="clearItemEdit(item.id, item.name)"
        type="button"
        class="underline"
      >
        Discard
      </button>
    </div>

    <button
      v-if="item.id !== activeItemId"
      @click="store.removeChecklistItem(item.id)"
      type="button"
    >
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCardStore } from '@/stores'
const store = useCardStore()
defineProps(['item'])

const activeItemId = ref('')
const activeItemName = ref('')
const beginItemNameEdit = (item: object) => {
  activeItemId.value = item.id

  item.unsaved_name
    ? (activeItemName.value = item.unsaved_name)
    : (activeItemName.value = item.name)
}
const storeUnsavedItemName = (existingName: string) => {
  // only store if names are different
  if (activeItemName.value && activeItemName.value !== existingName) {
    store.storeUnsavedChecklistItemName(
      activeItemId.value,
      activeItemName.value
    )
  }
  clearFocus()
}
const saveItemName = (existingName: string) => {
  if (!activeItemName.value) return
  if (activeItemName.value !== existingName) {
    store.updateChecklistItemName(activeItemId.value, activeItemName.value)
  }
  clearItemEdit(activeItemId.value, existingName)
}
const clearItemEdit = (id: string, existingName: string) => {
  if (activeItemName.value !== existingName) {
    store.deleteUnsavedChecklistItemName(id)
  }
  clearFocus()
}
const clearFocus = () => {
  activeItemId.value = ''
  activeItemName.value = ''
}
</script>

<style scoped lang="scss"></style>
