<template>
  <ul>
    <li
      v-for="item of store.cardDetails.checklist"
      :key="item.id"
      class="flex gap-x-3 border-2"
    >
      <input
        type="checkbox"
        @click.stop="store.toggleChecklistItemCompleted(item.id)"
        :checked="item.isCompleted"
      />
      <div>
        <div v-if="item.id === activeItemId" class="flex gap-x-3">
          <input
            class="editable-input"
            v-model="activeItemName"
            v-focus="item.id === activeItemId"
            @blur="storeUnsavedItemName(item.name)"
            @keyup.enter="saveItemName"
            @keyup.esc="clearItemEdit(item.id)"
          />
          <!-- NOTE 'mousedown' needed, as 'blur' triggers before 'click', meaning the button wouldn't exist in DOM, so its click would never trigger -->
          <button @mousedown="saveItemName">Save</button>
          <button @mousedown="clearItemEdit(item.id)">X</button>
        </div>
        <span
          v-else
          @click.stop="beginItemNameEdit(item)"
          :class="{ 'line-through': item.isCompleted }"
        >
          {{ item.name }}
        </span>
        <div
          v-if="item.id !== activeItemId && item.unsavedName"
          class="flex gap-x-3"
        >
          <span>You have unsaved edits.</span>
          <button @click="beginItemNameEdit(item)" class="underline">
            View edits
          </button>
          <button @click="clearItemEdit(item.id)" class="underline">
            Discard
          </button>
        </div>
      </div>
    </li>
  </ul>
  <div v-if="isCreatingItem">
    <input
      v-model="newItemName"
      v-focus="isCreatingItem"
      @blur="processItemCreation"
      placeholder="Add an item"
    />
    <button @mousedown="processItemCreation">Add</button>
    <button @mousedown="exitItemCreation">Cancel</button>
  </div>
  <button v-else @click="isCreatingItem = true" class="border-2">
    Add a checklist item
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useCardStore } from '@/stores'
import { v4 as uuidv4 } from 'uuid'
const store = useCardStore()

const isCreatingItem = ref(false)
const newItemName = ref('')
const processItemCreation = () => {
  if (!newItemName.value) {
    isCreatingItem.value = false
    return
  }

  const item = {
    id: uuidv4(),
    name: newItemName.value,
    isCompleted: false,
  }

  store.addChecklistItem(item)
  exitItemCreation()
}

const exitItemCreation = () => {
  newItemName.value = ''
  isCreatingItem.value = false
}

const activeItemId = ref('')
const activeItemName = ref('')
const beginItemNameEdit = (item: object) => {
  activeItemId.value = item.id

  item.unsavedName
    ? (activeItemName.value = item.unsavedName)
    : (activeItemName.value = item.name)
}
const storeUnsavedItemName = (itemName: string) => {
  // only store if names are different
  if (activeItemName.value && activeItemName.value !== itemName) {
    store.storeUnsavedChecklistItemName(
      activeItemId.value,
      activeItemName.value
    )
  }
  clearFocus()
}
const saveItemName = () => {
  store.updateChecklistItemName(activeItemId.value, activeItemName.value)
  clearItemEdit(activeItemId.value)
}
const clearItemEdit = (id: string) => {
  store.deleteUnsavedChecklistItemName(id)
  clearFocus()
}
const clearFocus = () => {
  activeItemId.value = ''
  activeItemName.value = ''
}
</script>

<style scoped lang="scss"></style>
