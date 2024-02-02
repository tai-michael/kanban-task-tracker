<template>
  <div class="flex justify-between p-2">
    <Title :title="list.title" @title-edited="changeListTitle" />
    <button
      @click="store.removeList(props.list.id)"
      type="button"
      class="bg-red-400"
    >
      Delete List
    </button>
  </div>

  <VueDraggable
    v-model="list.cards"
    ref="cardsEl"
    group="cards"
    :delay="200"
    :delay-on-touch-only="true"
    :animation="150"
    :fallback-tolerance="5"
    drag-class="drag"
    ghost-class="ghost"
    class="space-y-3 list-cards"
  >
    <div v-for="card in list.cards" :key="card.id">
      <CardPreview
        :card="card"
        @click="handleCardSelection(card.id)"
        class="cursor-pointer"
      />
    </div>

    <!-- maybe add an eventlistener and handler that would somehow drop the card at the end if hovering over and letting go here -->
    <!-- <template #footer>
      <button class="opacity-0 absolute bottom-[-5] p-2">Add</button>
    </template> -->
  </VueDraggable>

  <div class="px-2 pt-2">
    <CardComposer :listId="list.id" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject } from 'vue'
import Title from '@/components/Title.vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
import { VueDraggable } from 'vue-draggable-plus'
const CardPreview = defineAsyncComponent(
  () => import('@/components/CardPreview.vue')
)
const CardComposer = defineAsyncComponent(
  () => import('@/components/CardComposer.vue')
)
const store = useBoardStore()
const router = useRouter()
const props = defineProps(['list'])

const emit = defineEmits(['cardSelected'])
const handleCardSelection = (cardId: string) => {
  emit('cardSelected')
  router.push(`/card/${cardId}`)
}
const changeListTitle = (title: string) => {
  store.updateListTitle(props.list.id, title)
}
</script>

<style scoped lang="scss">
.list-cards {
  margin: 0 4px;
  padding: 2px 4px;
  overflow-y: auto;
  overflow-x: clip;
  max-height: calc(100svh - (var(--header-height-mobile) * 2 + 3rem));

  @media (min-width: 481px) {
    max-height: calc(100svh - (var(--header-height-desktop) * 2 + 1.5rem));
  }
}

.drag > * {
  transform: rotate(3deg);
}

.ghost {
  background-color: rgb(226, 226, 226);
  border-radius: 8px;
}

.ghost > * {
  visibility: hidden;
  // opacity: 0.2;
}
</style>
