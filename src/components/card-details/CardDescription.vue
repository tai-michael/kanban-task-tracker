<template>
  <li
    v-if="!isEditingDescription"
    @click="isEditingDescription = true"
    class="overflow-auto"
  >
    <span v-if="!store.cardDetails.description" class="italic"
      >Enter a description for this card...</span
    >
    <span v-else>
      {{ store.cardDetails.description }}
    </span>
  </li>
  <textarea
    v-else
    ref="textArea"
    v-model="cardDescription"
    v-focus="isEditingDescription"
    @input="adjustTextAreaHeight"
    @blur="changeCardDescription"
    class="w-full resize-none"
  />
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

<style scoped lang="scss"></style>
