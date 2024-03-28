<template>
  <div class="flex flex-col gap-x-2 mb-9">
    <div
      class="relative flex justify-between mb-2 ml-[var(--card-gutter-mobile)] xs:ml-[var(--card-gutter-desktop)]"
    >
      <div class="absolute left-[-35px]">
        <CheckSquareIcon
          class="!w-[22px] !h-[22px] text-[var(--card-text-subtle)]"
        />
      </div>
      <label class="block text-base font-semibold text-[var(--card-text)]"
        >Checklist</label
      >
    </div>

    <div class="ml-1 xs:ml-[var(--card-gutter-desktop)]">
      <VueDraggable
        v-model="store.cardDetails.checklist"
        v-bind="draggableOptions"
        class="mb-1"
      >
        <li
          v-for="item of store.cardDetails.checklist"
          :key="item.id"
          class="flex [&:last-child]:mb-1.5"
        >
          <ChecklistItem :item="item" />
        </li>
      </VueDraggable>

      <div
        ref="itemComposerRef"
        v-if="isCreatingItem"
        class="flex flex-col gap-y-2 w-full"
      >
        <input
          v-model.trim="newItemName"
          v-focus="isCreatingItem"
          @blur="processItemCreation"
          @keydown.enter="processItemCreation"
          @keydown.esc.prevent="exitItemCreation"
          placeholder="Add an item"
          class="p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-[var(--main-purple)]"
        />
        <div>
          <button
            @mousedown="processItemCreation"
            @keydown.enter="processItemCreation"
            @keydown.esc.prevent="exitItemCreation"
            type="submit"
            class="mr-2 inline-flex py-[6px] px-[16px] rounded font-medium text-white bg-[var(--card-primary-button)] hover:bg-[var(--card-primary-button-hover)] active:bg-[var(--card-primary-button-hover)] transition-colors duration-100 ease-in-out"
          >
            Add
          </button>
          <button
            @mousedown="exitItemCreation"
            @keydown.enter="exitItemCreation"
            @keydown.esc.prevent="exitItemCreation"
            type="button"
            class="py-[6px] px-[16px] rounded font-medium text-[var(--card-text)] hover:bg-[var(--card-secondary-button-hover)] active:bg-[var(--card-secondary-button-hover)] transition-colors duration-100 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>

      <button
        v-else
        @click="isCreatingItem = true"
        type="button"
        class="inline-flex py-[6px] px-[16px] rounded font-medium text-[var(--card-text)] bg-[var(--card-secondary-button)] hover:bg-[var(--card-secondary-button-hover)] active:bg-[var(--card-secondary-button-hover)] transition-colors duration-100 ease-in-out"
      >
        Add item
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, nextTick } from 'vue'
import ChecklistItem from '@/components/card-details/ChecklistItem.vue'
import CheckSquareIcon from '@/assets/icons/icon-check-square.vue'
import { useCardStore } from '@/stores'
import { v4 as uuidv4 } from 'uuid'
import { VueDraggable } from 'vue-draggable-plus'
const store = useCardStore()
const isMobileView = inject('isMobileView')
const draggableOptions = computed(() => {
  return {
    group: 'checklistItems',
    delayOnTouchOnly: true,
    delay: 200,
    animation: 150,
    fallbackTolerance: 3,
    revertOnSpill: true,
    forceFallback: true,
    scroll: true,
    scrollSensitivity: 90,
    bubbleScroll: true,
    chosenClass: isMobileView.value ? 'tilted' : '',
    dragClass: isMobileView.value ? 'tilted' : 'dragged',
    ghostClass: 'ghost',
    disabled: isCreatingItem.value ? true : false,
  }
})

const isCreatingItem = ref(false)
const newItemName = ref('')
const processItemCreation = (event) => {
  // NOTE tabbing while input is focused triggers blur, so the conditional is used to prevent that and allow tabbing to buttons
  if (event.relatedTarget && event.relatedTarget.tagName === 'BUTTON') {
    return
  }

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

// Below necessary, as default mobile scroll behavior is buggy at times, especially if add item button is clicked at the very bottom of a long card.
const itemComposerRef = ref(null)
watch(isCreatingItem, async (newValue) => {
  if (newValue && isMobileView.value) {
    await nextTick()
    setTimeout(() => {
      itemComposerRef.value?.scrollIntoView({
        block: 'center',
      })
    }, 200)
  }
})
</script>

<style scoped lang="scss">
.tilted > * {
  transform: rotate(3deg);
  background-color: var(--main-purple-transparent-light);
}

.dragged > * {
  background-color: var(--main-purple-transparent-light);
}

.ghost > * {
  opacity: 0.5;
}
</style>
