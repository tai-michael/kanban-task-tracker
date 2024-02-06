<template>
  <div ref="inputRef" class="input-form">
    <textarea
      v-model.trim="newCardTitle"
      v-focus="isCreatingCard"
      @blur="handleBlur"
      @keyup.enter="processCardCreation"
      @keyup.esc="resetCardCreationState"
      placeholder="Enter a card title"
      class="w-full"
    />
  </div>
  <div class="flex gap-x-3">
    <button
      @mousedown="processCardCreation"
      type="submit"
      class="border-2 pl-2 pr-2"
    >
      Save
    </button>
    <button
      @mousedown="resetCardCreationState"
      type="button"
      class="border-2 pl-2 pr-2"
    >
      X
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import createAndAddCard from '@/composables/createAndAddCard'
const props = defineProps(['listId', 'isCreatingCard'])
const emit = defineEmits(['exitCardComposer'])
// TODO add 'required' to all required props in project
const newCardTitle = ref('')

// extra flag needed to prevent blur handler from triggering unnecessarily; props do not 'refresh' until the function has completed, so using props.isCreatingCard as the flag does not work
const processingComplete = ref(false)
const handleBlur = () => {
  if (processingComplete.value) return
  processCardCreation()
}

const processCardCreation = () => {
  if (newCardTitle.value) createAndAddCard(props.listId, newCardTitle.value)
  resetCardCreationState()
  processingComplete.value = true
}

const resetCardCreationState = () => {
  newCardTitle.value = ''
  emit('exitCardComposer')
  processingComplete.value = true
}

const inputRef = ref()
onMounted(() => {
  inputRef.value.scrollIntoView({ behavior: 'smooth' })
})
</script>

<style scoped lang="scss">
.input-form {
  user-select: none;
  display: flex;
  padding: 12px;
  margin-bottom: 8px;
  background: #73b2f1;
  border: black 1px solid;
  border-radius: 8px;
  min-height: 24px;
}
</style>
