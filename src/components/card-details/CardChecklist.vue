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
          />
          <button @click="saveItemName">Save</button>
          <button @click="clearItemEdit(item.id)">X</button>
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
          <button @click.stop="beginItemNameEdit(item)" class="underline">
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
      @blur="createItem"
      placeholder="Add an item"
    />
    <button @click="createItem">Add</button>
    <button @click="cancelCreateItem">Cancel</button>
  </div>
  <button v-else @click="isCreatingItem = true" class="border-2">
    Add a checklist item
  </button>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useCardStore } from '@/stores'
import { onMounted, onUnmounted, ref } from 'vue'
const store = useCardStore()

const isCreatingItem = ref(false)
const newItemName = ref('')
const createItem = () => {
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
  cancelCreateItem()
}

const cancelCreateItem = () => {
  newItemName.value = ''
  isCreatingItem.value = false
}

const activeItemId = ref('')
const activeItemName = ref('')
const beginItemNameEdit = (item: object) => {
  // stopping propagation is necessary, as there's a global click handler that triggers clearFocus() for any non 'editable-input' class
  activeItemId.value = item.id

  item.unsavedName
    ? (activeItemName.value = item.unsavedName)
    : (activeItemName.value = item.name)
}
const storeUnsavedItemName = (itemName: string) => {
  if (activeItemName.value === itemName) return // only store if different
  store.storeUnsavedChecklistItemName(activeItemId.value, activeItemName.value)
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
// NOTE Using event listener instead of @blur, as blur triggers its callback immediately upon losing focus, leading to the removal of the 'Save' and 'X' buttons before their click events can be registered. The global click listener, on the other hand, allows for a conditional check that properly registers button clicks before modifying the DOM.
const handleGlobalClick = (e) => {
  if (!e.target.classList.contains('editable-input')) {
    clearFocus()
  }
}
onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
})
onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped lang="scss"></style>
