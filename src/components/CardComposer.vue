<template>
  <div ref="inputRef" class="input-form">
    <textarea
      v-model.trim="newCardTitle"
      v-focus="isCreatingCard"
      @blur="handleBlur"
      @keyup.enter="processCardCreation"
      @keyup.esc="resetCardCreationState"
      placeholder="Enter a card title"
      class="w-full resize-none focus:outline-none"
    />
  </div>

  <div class="flex gap-x-1.5">
    <button
      @mousedown="processCardCreation"
      type="submit"
      class="px-4 rounded text-white bg-[var(--main-purple)] hover:bg-[var(--main-purple-hover)] active:bg-[var(--main-purple-hover)]"
    >
      Add card
    </button>
    <button
      @mousedown="resetCardCreationState"
      type="button"
      class="p-2.5 rounded hover:bg-[var(--icon-button-hover)] active:bg-[var(--icon-button-active)]"
    >
      <img :src="CrossIcon" class="w-3.5 h-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'
import createAndAddCard from '@/composables/createAndAddCard'
// TODO add 'required' to all required props in project
const props = defineProps(['listId', 'isCreatingCard'])
const emit = defineEmits(['exitCardComposer'])
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
  background: white;
  box-shadow: var(--box-shadow-light);
  border-radius: 8px;
  min-height: 24px;
}
</style>
