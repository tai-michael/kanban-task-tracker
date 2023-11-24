<template>
  <Title :title="list.title" @title-edited="changeListTitle" />

  <draggable
    v-model="list.cards"
    group="cards"
    item-key="id"
    :animation="150"
    drag-class="drag"
    ghost-class="ghost"
    class="space-y-3"
  >
    <template #item="{ element: card }">
      <div>
        <CardPreview
          :card="card"
          :is-creating-card="false"
          @click="router.push(`/card/${card.id}`)"
          class="cursor-pointer"
        />
      </div>
    </template>
  </draggable>

  <CardPreview
    v-if="isCreatingCard"
    :is-creating-card="isCreatingCard"
    @create-card="createCard"
  />
  <button @click="beginCreatingCard" class="border-2">+ Add a card</button>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import Title from '@/components/Title.vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
import { useCardStore } from '@/stores'
import draggable from 'vuedraggable'
import { v4 as uuidv4 } from 'uuid'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
const CardPreview = defineAsyncComponent(
  () => import('@/components/CardPreview.vue')
)
const boardStore = useBoardStore()
const cardStore = useCardStore()
const router = useRouter()
const props = defineProps(['list'])

const changeListTitle = (title: string) => {
  boardStore.updateListTitle(props.list.id, title)
}
const isCreatingCard = ref(false)

const beginCreatingCard = () => {
  isCreatingCard.value = true
}
const createCard = (title: string) => {
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

  boardStore.addCard(props.list.id, cardSummary)
  cardStore.memoizeCard(cardDetails)
  updateFirestoreDoc('cards', cardDetails.id, cardDetails, false)
  isCreatingCard.value = false
}
</script>

<style scoped lang="scss">
h2 {
  font-weight: 600;
  font-size: 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
}

.drag > div {
  transform: rotate(3deg);
}

.ghost {
  background-color: rgb(226, 226, 226);
  border-radius: 8px;
}

.ghost > div {
  visibility: hidden;
  // opacity: 0.2;
}
</style>
