<template>
  <div v-if="isCreatingCard">
    <div class="input-form">
      <textarea
        v-model="newCardTitle"
        v-focus="isCreatingCard"
        @blur="processCardCreation"
        placeholder="Add a title for this card"
        class="w-full"
      />
    </div>
    <div class="flex gap-x-3">
      <button @mousedown="processCardCreation" class="border-2 pl-2 pr-2">
        Save
      </button>
      <button @mousedown="resetCardCreationState" class="border-2 pl-2 pr-2">
        X
      </button>
    </div>
  </div>
  <button v-else @click.stop="isCreatingCard = true" class="border-2 pl-2 pr-2">
    + Add a card
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import createAndAddCard from '@/composables/createAndAddCard'
const props = defineProps(['listId'])
const isCreatingCard = ref(false)
const newCardTitle = ref('')

const processCardCreation = () => {
  if (newCardTitle.value) createAndAddCard(props.listId, newCardTitle.value)
  resetCardCreationState()
}

const resetCardCreationState = () => {
  newCardTitle.value = ''
  isCreatingCard.value = false
}
</script>

<style scoped lang="scss">
.input-form {
  display: flex;
  padding: 12px;
  margin: 8px 4px;
  background: #73b2f1;
  border: black 1px solid;
  border-radius: 8px;
  min-height: 24px;
}
</style>
