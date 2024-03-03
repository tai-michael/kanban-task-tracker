<template>
  <div class="flex w-full py-2 gap-x-4 relative">
    <input
      type="checkbox"
      @click.stop="store.toggleChecklistItemCompleted(item.id)"
      :checked="item.is_completed"
      class="absolute top-[21px]"
    />

    <div class="flex flex-col w-full ml-7">
      <div class="flex gap-y-3 w-full justify-between items-center">
        <div
          v-if="item.id === activeItemId"
          class="w-full flex flex-col gap-y-3"
        >
          <input
            v-model.trim="activeItemName"
            v-focus="item.id === activeItemId"
            @blur="storeUnsavedItemName(item.name)"
            @keyup.enter="saveItemName(item.name)"
            @keyup.esc="clearItemEdit(item.id, item.name)"
            class="p-1.5"
          />

          <!-- NOTE 'mousedown' needed, as 'blur' triggers before 'click', meaning the button wouldn't exist in DOM, so its click would never trigger -->
          <div class="flex justify-between">
            <div class="flex">
              <button
                @mousedown="saveItemName(item.name)"
                type="submit"
                class="mr-1.5 inline-flex py-[6px] px-[16px] rounded font-medium bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] active:bg-[var(--medium-blue)] text-white transition-colors duration-100 ease-in-out"
              >
                Save
              </button>
              <button
                @mousedown="clearItemEdit(item.id, item.name)"
                type="button"
                class="flex items-center justify-center h-[34.5px] w-[34.5px] rounded hover:bg-[var(--light-gray-button-hover)] active:bg-[var(--light-gray-button-hover)] transition-colors duration-100 ease-in-out"
              >
                <img :src="CrossIcon" class="w-4 h-4" />
              </button>
            </div>

            <button
              @mousedown="handleDeleteItem(item.id)"
              type="button"
              class="px-2 rounded hover:bg-[var(--light-gray-button-hover)] active:bg-[var(--light-gray-button-hover)] transition-colors duration-100 ease-in-out"
            >
              <label class="font-medium select-none cursor-pointer"
                >Delete item</label
              >
            </button>
          </div>
        </div>

        <span
          v-else
          @click.stop="beginItemNameEdit(item)"
          class="max-w-[235px] xs:max-w-[310px] sm:max-w-[400px] truncate"
          :class="{ 'line-through': item.is_completed }"
          :title="item.name"
        >
          {{ item.name }}
        </span>

        <EllipsisMenu
          v-if="item.id !== activeItemId"
          ref="ellipsisMenuRef"
          :popover-classes="'!top-[-40px] !right-[25px]'"
        >
          <template #custom-buttons>
            <div class="flex flex-col">
              <button
                @click="handleDeleteItem(item.id)"
                type="button"
                class="ellipsis-popover__button p-3"
              >
                <DeleteIcon />
                <label class="select-none">Delete</label>
              </button>
            </div>
          </template>
        </EllipsisMenu>
      </div>

      <div
        v-if="item.id !== activeItemId && item.unsaved_name"
        class="flex flex-col gap-x-4 xs:flex-row xs:gap-x-2"
      >
        <span class="xs:max-w-[unset]">You have unsaved edits.</span>
        <div class="flex gap-x-1.5 mt-2 xs:mt-0">
          <button
            @click="beginItemNameEdit(item)"
            type="button"
            class="underline"
          >
            View edits
          </button>
          <span>•</span>
          <button
            @click="clearItemEdit(item.id, item.name)"
            type="button"
            class="underline"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EllipsisMenu from '@/components/EllipsisMenu.vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'
import DeleteIcon from '@/assets/icons/icon-delete.vue'
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

const handleDeleteItem = (id: string) => {
  store.removeChecklistItem(id)
  activeItemName.value = ''
}
</script>

<style scoped lang="scss"></style>
