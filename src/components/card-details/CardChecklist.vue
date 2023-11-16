<template>
  <ul>
    <li
      v-for="item of store.cardDetails.checklist"
      :key="item.id"
      class="flex flex-col gap-x-3 border-2"
    >
      <div v-if="item.id === activeItemId" class="flex gap-x-3">
        <input
          class="editable-input"
          v-model="activeItemName"
          v-focus="item.id === activeItemId"
          @blur="storeItemNameEdit(item.name)"
        />
        <button @click="saveItemName">Save</button>
        <button @click="clearItemEdit(item.id)">X</button>
      </div>
      <span v-else @click="beginItemNameEdit(item, $event)">
        {{ item.name }}
      </span>
      <div
        v-if="itemEditStates[item.id] && item.id !== activeItemId"
        class="flex gap-x-3"
      >
        <span>You have unsaved changes</span>
        <button @click="beginItemNameEdit(item, $event)">View edits</button>
        <button @click="clearItemEdit(item.id)">Discard</button>
      </div>
      <!-- TODO add checkbox and delete btn + logic (refer to Trello) -->
    </li>
  </ul>
  <input
    v-if="isCreatingItem"
    v-model="newItemName"
    v-focus="isCreatingItem"
    @blur="createItem"
    placeholder="Add an item"
  />
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
  const item = {
    id: uuidv4(),
    name: newItemName.value,
    isCompleted: false,
  }

  store.addChecklistItem(item)
  newItemName.value = ''
  isCreatingItem.value = false
}

const itemEditStates = ref({})
const activeItemId = ref('')
const activeItemName = ref('')
const beginItemNameEdit = (item: object, event: MouseEvent) => {
  event.stopPropagation()
  activeItemId.value = item.id

  if (itemEditStates.value[item.id]) {
    activeItemName.value = itemEditStates.value[item.id].name
  } else {
    activeItemName.value = item.name
  }
}
const storeItemNameEdit = (itemName: string) => {
  // Avoids storing a draft in case the name is unchanged
  if (itemName === activeItemName.value) return

  itemEditStates.value[activeItemId.value] = {
    name: activeItemName.value,
  }
}
const saveItemName = () => {
  store.updateChecklistItemName(activeItemId.value, activeItemName.value)
  clearItemEdit(activeItemId.value)
}
const clearItemEdit = (id: string) => {
  delete itemEditStates.value[id]
  clearFocus()
}
const clearFocus = () => {
  activeItemId.value = ''
  activeItemName.value = ''
}
// NOTE The event listener is needed, because with 'blur' the focus is lost immediately (thereby triggering its callback immediately). The callback (clearFocus()) clears the activeItemId, which then removes the Save and X buttons from the DOM before any click on them is even registered. By contrast, the global click listener provides a conditional check, allowing button clicks to be registered first.
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
