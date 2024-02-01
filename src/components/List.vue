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

  <draggable
    v-model="list.cards"
    group="cards"
    item-key="id"
    :animation="150"
    drag-class="drag"
    ghost-class="ghost"
    class="space-y-3 list-cards"
  >
    <template #item="{ element: card }">
      <div>
        <CardPreview
          :card="card"
          @click="handleCardSelection(card.id)"
          class="cursor-pointer"
        />
      </div>
    </template>
  </draggable>

  <div class="px-2 pt-2">
    <CardComposer :listId="list.id" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Title from '@/components/Title.vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
import draggable from 'vuedraggable'
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
