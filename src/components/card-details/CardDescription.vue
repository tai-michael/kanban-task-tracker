<template>
  <div class="flex flex-col gap-x-2 mb-9">
    <div
      class="relative flex justify-between mb-1 ml-[var(--card-gutter-mobile)] xs:ml-[var(--card-gutter-desktop)]"
    >
      <div class="absolute left-[-35px]">
        <TextIcon class="w-6 h-6 text-[var(--card-text-subtle)]" />
      </div>
      <label class="block mb-2 text-base font-semibold text-[var(--card-text)]"
        >Description</label
      >
    </div>

    <div class="xs:ml-[var(--card-gutter-desktop)] flex flex-col">
      <li
        v-if="!isEditingDescription"
        @click="isEditingDescription = true"
        class="overflow-auto"
      >
        <span
          v-if="!store.cardDetails.description"
          class="fake-text-area cursor-pointer"
        >
          Enter a description for this card...
        </span>

        <span v-else class="break-words text-[var(--card-text-subtle)]">
          {{ store.cardDetails.description }}
        </span>
      </li>

      <div v-else class="flex flex-col gap-y-2">
        <textarea
          ref="textArea"
          v-model.trim="cardDescription"
          v-focus="isEditingDescription"
          @focus="setDescription"
          @input="adjustTextAreaHeight"
          @blur="changeDescription"
          @keydown.esc.prevent="cancelEditingDescription"
          class="w-full resize-none py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[var(--main-purple)]"
        />

        <div>
          <button
            @mousedown="changeDescription"
            @keydown.enter.prevent="changeDescription"
            @keydown.esc.prevent="cancelEditingDescription"
            type="submit"
            class="mr-2 inline-flex py-[6px] px-[16px] rounded font-medium text-white bg-[var(--card-primary-button)] hover:bg-[var(--card-primary-button-hover)] active:bg-[var(--card-primary-button-hover)] transition-colors duration-100 ease-in-out"
          >
            Save
          </button>
          <button
            @mousedown="cancelEditingDescription"
            @keydown.enter="cancelEditingDescription"
            @keydown.esc.prevent="cancelEditingDescription"
            type="button"
            class="py-[6px] px-[10px] rounded font-medium text-[var(--card-text)] hover:bg-[var(--card-secondary-button-hover)] active:bg-[var(--card-secondary-button-hover)] transition-colors duration-100 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import TextIcon from '@/assets/icons/icon-text.vue'
import { useCardStore } from '@/stores'
const store = useCardStore()
const cardDescription = ref('')
const isEditingDescription = ref(false)
const textArea = ref(null)
const adjustTextAreaHeight = () => {
  nextTick(() => {
    if (textArea.value) {
      textArea.value.style.height = 'auto' // Reset height to recalculate
      textArea.value.style.height = textArea.value.scrollHeight + 'px' // Set to scroll height
    }
  })
}

watch(isEditingDescription, (newValue) => {
  if (newValue) {
    adjustTextAreaHeight()
  }
})

const changeDescription = (event) => {
  // NOTE tabbing while input is focused triggers blur, so the second set of conditions is used to prevent that and allow tabbing to buttons
  if (
    !isEditingDescription.value ||
    (event.relatedTarget && event.relatedTarget.tagName === 'BUTTON')
  ) {
    return
  }

  store.updateCardDescription(cardDescription.value)
  isEditingDescription.value = false
}

const cancelEditingDescription = () => {
  cardDescription.value = ''
  isEditingDescription.value = false
}

// NOTE canceling an edit clears the description, so this is a workaround
const setDescription = () => {
  if (cardDescription.value) return
  cardDescription.value = store.cardDetails.description
}

onMounted(() => {
  cardDescription.value = store.cardDetails.description
})
</script>

<style scoped lang="scss">
.fake-text-area {
  display: block;
  min-height: 55px;
  padding: 8px 12px;
  background-color: var(--card-secondary-button);
  font-weight: 500;
  border-radius: 3px;
  color: var(--card-text);
  text-decoration: none;
  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: var(--card-secondary-button-hover);
  }
}

.dark .fake-text-area {
  background-color: var(--card-secondary-button);
  color: rgb(180, 180, 180);

  &:hover {
    background-color: var(--card-secondary-button-hover);
  }
}
</style>
