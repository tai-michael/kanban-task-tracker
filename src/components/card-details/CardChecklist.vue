<template>
  <ul>
    <li v-for="item of store.cardDetails.checklist" :key="item.id">
      <div v-if="item.id === activeItemId">
        <input
          v-model="activeItemName"
          v-focus="item.id === activeItemId"
          @blur="storeItemNameEdit()"
        />
        <button :disabled="!activeItemName" @click="saveItemName()">
          Save
        </button>
        <!-- TODO add discard edit button and logic -->
      </div>
      <span v-else @click="beginItemNameEdit(item)">
        {{ item.name }}
      </span>
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
import { ref } from 'vue'
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
const beginItemNameEdit = (item: object) => {
  activeItemId.value = item.id
  if (itemEditStates.value[item.id]) {
    activeItemName.value = itemEditStates.value[item.id].name
  } else {
    activeItemName.value = item.name
  }
}
const storeItemNameEdit = () => {
  itemEditStates.value[activeItemId.value] = {
    name: activeItemName.value,
  }
}
const saveItemName = () => {
  store.updateChecklistItemName(activeItemId.value, activeItemName.value)
  activeItemId.value = ''
  activeItemName.value = ''
}
</script>

<style scoped lang="scss"></style>
