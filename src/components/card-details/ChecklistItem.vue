<template>
  <div
    class="flex w-full py-2 pl-4 pr-2 gap-x-4 my-1 relative rounded bg-[var(--very-light-gray)] dark:bg-[var(--darkest-gray)]"
    :class="
      item.id === activeItemId
        ? 'pt-3 pb-2.5'
        : 'hover:!bg-[var(--main-purple-transparent-light)]'
    "
  >
    <input
      type="checkbox"
      @click.stop="store.toggleChecklistItemCompleted(item.id)"
      :checked="item.is_completed"
      class="absolute top-[20px] accent-[var(--main-purple)] hover:accent-[hsla(242,58%,68%)] w-4 h-4"
    />

    <div class="flex flex-col gap-y-1 w-full ml-7">
      <div class="flex gap-y-3 w-full justify-between items-center">
        <div
          v-if="item.id === activeItemId"
          class="w-full flex flex-col gap-y-2"
        >
          <input
            v-model.trim="activeItemName"
            v-focus
            @blur="storeUnsavedItemName($event, item.name)"
            @keydown.enter="saveItemName(item.name)"
            @keydown.esc.prevent="clearItemEdit(item.id, item.name)"
            class="py-1.5 px-2.5 mr-0.5 rounded focus:outline-none focus:ring-2 focus:ring-[var(--main-purple)]"
          />

          <!-- NOTE 'mousedown' needed, as 'blur' triggers before 'click', meaning the button wouldn't exist in DOM, so its click would never trigger -->
          <div class="flex justify-between">
            <div class="flex">
              <button
                @mousedown="saveItemName(item.name)"
                @keydown.enter.prevent="saveItemName(item.name)"
                @keydown.esc.prevent="clearItemEdit(item.id, item.name)"
                type="submit"
                class="mr-1.5 inline-flex py-[6px] px-[16px] rounded font-medium bg-[var(--card-primary-button)] hover:bg-[var(--card-primary-button-hover)] active:bg-[var(--card-primary-button-hover)] text-white transition-colors duration-100 ease-in-out"
              >
                Save
              </button>
              <button
                @mousedown="clearItemEdit(item.id, item.name)"
                @keydown.enter="clearItemEdit(item.id, item.name)"
                @keydown.esc.prevent="clearItemEdit(item.id, item.name)"
                type="button"
                class="flex items-center justify-center h-[34.5px] w-[34.5px] rounded hover:bg-[var(--card-secondary-button-hover)] active:bg-[var(--card-secondary-button-hover)] transition-colors duration-100 ease-in-out"
              >
                <CrossIcon />
              </button>
            </div>

            <button
              @mousedown="handleDeleteItem(item.id)"
              @keydown.enter="handleDeleteItem(item.id)"
              @keydown.esc.prevent="clearItemEdit(item.id, item.name)"
              type="button"
              class="px-3 rounded hover:bg-[var(--card-secondary-button-hover)] active:bg-[var(--card-secondary-button-hover)] transition-colors duration-100 ease-in-out"
            >
              <label
                class="font-medium text-[var(--light-red)] select-none cursor-pointer"
                >Delete item</label
              >
            </button>
          </div>
        </div>

        <span
          v-else
          @click.stop="beginItemNameEdit(item)"
          class="max-w-[220px] xs:max-w-[266px] sm:max-w-[380px] break-words font-bold dark:text-[var(--card-text)] text-sm"
          :class="{
            'line-through opacity-50': item.is_completed,
          }"
          :title="item.name"
        >
          {{ item.name }}
        </span>

        <EllipsisMenu
          v-if="item.id !== activeItemId"
          :popover-classes="'!top-[-40px] !right-[25px]'"
        >
          <template #custom-buttons>
            <div class="flex flex-col">
              <button
                @click="handleDeleteItem(item.id)"
                type="button"
                class="ellipsis-popover__button p-3"
              >
                <DeleteIcon class="text-[var(--light-red)]" />
                <label class="select-none text-[var(--light-red)]"
                  >Delete</label
                >
              </button>
            </div>
          </template>
        </EllipsisMenu>
      </div>

      <div
        v-if="item.id !== activeItemId && item.unsaved_name"
        class="flex flex-col gap-x-4 xs:flex-row xs:gap-x-2 text-[var(--card-text-subtle)]"
      >
        <span class="xs:max-w-[unset]">You have unsaved edits.</span>
        <div class="flex gap-x-1.5 mt-2 xs:mt-0">
          <button
            @click="beginItemNameEdit(item)"
            type="button"
            class="underline hover:text-[hsla(242,48%,58%,70%)] dark:hover:text-white"
          >
            View edits
          </button>
          <span>•</span>
          <button
            @click="clearItemEdit(item.id, item.name)"
            type="button"
            class="underline hover:text-[hsla(242,48%,58%,70%)] dark:hover:text-white"
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
import CrossIcon from '@/assets/icons/icon-cross.vue'
import DeleteIcon from '@/assets/icons/icon-delete.vue'
import { useCardStore } from '@/stores'
const store = useCardStore()
defineProps(['item'])
const emit = defineEmits(['isEditingItemName', 'stoppedEditingItemName'])

const activeItemId = ref('')
const activeItemName = ref('')
const beginItemNameEdit = (item: object) => {
  emit('isEditingItemName') // disables item dragging, allowing selection of text
  activeItemId.value = item.id

  item.unsaved_name
    ? (activeItemName.value = item.unsaved_name)
    : (activeItemName.value = item.name)
}

const storeUnsavedItemName = (event, existingName: string) => {
  // NOTE tabbing while input is focused triggers blur, so the conditional is used to prevent that and allow tabbing to buttons
  if (event.relatedTarget && event.relatedTarget.tagName === 'BUTTON') {
    return
  }

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
  emit('stoppedEditingItemName')
}

const handleDeleteItem = (id: string) => {
  store.deleteChecklistItem(id)
  activeItemName.value = ''
  emit('stoppedEditingItemName')
}
</script>

<style scoped lang="scss"></style>
