<template>
  <div v-if="isCreatingCard">
    <div class="input-form">
      <textarea
        v-model="newCardTitle"
        v-focus="isCreatingCard"
        @blur="processCardCreation"
        placeholder="Add a title for this card"
      />
    </div>
  </div>
  <button v-else @click.stop="isCreatingCard = true" class="border-2 pl-2 pr-2">
    + Add a card
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores'
import { useCardStore } from '@/stores'
import { v4 as uuidv4 } from 'uuid'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
const boardStore = useBoardStore()
const cardStore = useCardStore()
const props = defineProps(['listId'])

const isCreatingCard = ref(false)
const newCardTitle = ref('')

const processCardCreation = () => {
  if (newCardTitle.value) createAndAddCard(newCardTitle.value)
  resetCardCreationState()
}

const createAndAddCard = (title: string) => {
  const cardId = uuidv4()
  const cardSummary = {
    title: title,
    id: cardId,
    due_date: '(due date)',
    checklist_progress: '(checklist progress)',
  }
  const cardDetails = {
    id: cardId,
    boardId: boardStore.board.id,
    description: '',
    checklist: [],
    attachments: '(attachments)',
  }

  boardStore.addCard(props.listId, cardSummary)
  cardStore.memoizeCard(cardDetails)
  updateFirestoreDoc('cards', cardDetails.id, cardDetails, false)
}

const resetCardCreationState = () => {
  newCardTitle.value = ''
  isCreatingCard.value = false
}
</script>

<style scoped lang="scss">
.input-form {
  padding: 12px;
  margin: 8px 4px;
  background: #73b2f1;
  border: black 1px solid;
  border-radius: 8px;
  min-height: 24px;
}
</style>
