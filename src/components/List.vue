<template>
  <div class="flex justify-between">
    <Title :title="list.title" @title-edited="changeListTitle" />
    <button class="bg-red-400" @click="store.removeList(props.list.id)">
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
    class="space-y-3"
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

  <CardComposer :listId="list.id" />
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
