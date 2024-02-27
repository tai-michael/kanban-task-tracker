<template>
  <div class="flex gap-x-2 mb-7">
    <div class="hidden xs:block">(Icon)</div>
    <div class="w-full">
      <label class="block mb-2 text-base font-semibold text-[var(--card-text)]"
        >Description</label
      >

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

        <span v-else class="break-words">
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
  background-color: #091e420f;
  font-weight: 500;
  border-radius: 3px;
  color: var(--card-text);
  text-decoration: none;
}
</style>
