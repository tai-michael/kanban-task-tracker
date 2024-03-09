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

    <div class="xs:ml-[var(--card-gutter-desktop)]">
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

        <span v-else class="break-words dark:text-[var(--card-text-subtle)]">
          {{ store.cardDetails.description }}
        </span>
      </li>

      <textarea
        v-else
        ref="textArea"
        v-model.trim="cardDescription"
        v-focus="isEditingDescription"
        @input="adjustTextAreaHeight"
        @blur="changeCardDescription"
        class="w-full resize-none py-3 px-4"
      />
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
const changeCardDescription = () => {
  store.updateCardDescription(cardDescription.value)
  isEditingDescription.value = false
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
  background-color: var(--darkest-gray);
  color: var(--card-text-subtle);

  &:hover {
    background-color: var(--darkest-gray-hover);
  }
}
</style>
