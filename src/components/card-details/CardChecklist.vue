<template>
  <div class="flex flex-col gap-x-2 mb-9">
    <div
      class="relative flex justify-between mb-2 ml-[var(--card-gutter-mobile)] xs:ml-[var(--card-gutter-desktop)]"
    >
      <div class="absolute left-[-35px]">
        <CheckSquareIcon
          class="!w-[22px] !h-[22px]"
          :color="'hsla(218, 24%, 35%)'"
        />
      </div>
      <label class="block text-base font-semibold text-[var(--card-text)]"
        >Checklist</label
      >
    </div>

    <div class="ml-1 xs:ml-[var(--card-gutter-desktop)]">
      <ul class="mb-1">
        <li
          v-for="item of store.cardDetails.checklist"
          :key="item.id"
          class="flex [&:not(:last-child)]:border-b"
        >
          <ChecklistItem :item="item" />
        </li>
      </ul>

      <div v-if="isCreatingItem" class="flex flex-col w-full">
        <input
          v-model.trim="newItemName"
          v-focus="isCreatingItem"
          @blur="processItemCreation"
          placeholder="Add an item"
          class="p-1.5 mb-3"
        />
        <div>
          <button
            @mousedown="processItemCreation"
            type="submit"
            class="mr-2 inline-flex py-[6px] px-[16px] rounded font-medium text-white bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] active:bg-[var(--medium-blue)] transition-colors duration-100 ease-in-out"
          >
            Add
          </button>
          <button
            @mousedown="exitItemCreation"
            type="button"
            class="py-[6px] px-[16px] rounded font-medium text-[var(--card-text)] hover:bg-[var(--light-gray-button-hover)] active:bg-[var(--light-gray-button-hover)] transition-colors duration-100 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>

      <button
        v-else
        @click="isCreatingItem = true"
        type="button"
        class="inline-flex py-[6px] px-[16px] rounded font-medium text-[var(--card-text)] bg-[var(--light-gray-button)] hover:bg-[var(--light-gray-button-hover)] active:bg-[var(--light-gray-button-hover)] transition-colors duration-100 ease-in-out"
      >
        Add item
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ChecklistItem from '@/components/card-details/ChecklistItem.vue'
import CheckSquareIcon from '@/assets/icons/icon-check-square.vue'
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

const itemsCompleted = computed(
  () => store.cardDetails.checklist.filter((item) => item.is_completed).length
)
watch(
  () => itemsCompleted.value,
  (newValue) => {
    store.syncChecklistItemsCompleted(newValue)
  }
)

const itemsTotal = computed(() => store.cardDetails.checklist.length)
watch(
  () => itemsTotal.value,
  (newValue) => {
    store.syncChecklistItemsTotal(newValue)
  }
)
</script>

<style scoped lang="scss"></style>
