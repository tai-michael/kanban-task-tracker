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
        :checked="item.is_completed"
      />
      <div class="flex gap-x-2 w-full">
        <div
          v-if="item.id === activeItemId"
          class="flex flex-col gap-x-3 w-full"
        >
          <input
            class="flex"
            v-model="activeItemName"
            v-focus="item.id === activeItemId"
            @blur="storeUnsavedItemName(item.name)"
            @keyup.enter="saveItemName(item.name)"
            @keyup.esc="clearItemEdit(item.id, item.name)"
          />
          <!-- NOTE 'mousedown' needed, as 'blur' triggers before 'click', meaning the button wouldn't exist in DOM, so its click would never trigger -->
          <button @mousedown="saveItemName">Save</button>
          <button @mousedown="clearItemEdit(item.id)">X</button>
          <div class="flex justify-between">
            <div>
              <button @mousedown="saveItemName(item.name)" class="mr-3">
                Save
              </button>
              <button @mousedown="clearItemEdit(item.id, item.name)">X</button>
            </div>
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
          <button @click="beginItemNameEdit(item)" class="underline">
            View edits
          </button>
          <button @click="clearItemEdit(item.id, item.name)" class="underline">
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
import { ref, computed, watch } from 'vue'
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
    is_completed: false,
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
  if (!activeItemName.value.trim()) return
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

const itemsCompleted = computed(
  () => store.cardDetails.checklist.filter((item) => item.is_completed).length
)
watch(
  () => itemsCompleted.value,
  (newValue) => {
    store.updateChecklistItemsCompleted(newValue)
  }
)
const itemsTotal = computed(() => store.cardDetails.checklist.length)
watch(
  () => itemsTotal.value,
  (newValue) => {
    store.updateChecklistItemsTotal(newValue)
  }
)
</script>

<style scoped lang="scss"></style>
