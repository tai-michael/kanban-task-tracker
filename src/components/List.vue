<template>
  <h2>{{ list.name }}</h2>

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
          @click="router.push(`/card/${card.id}`)"
        ></CardPreview>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
import draggable from 'vuedraggable'
const CardPreview = defineAsyncComponent(
  () => import('@/components/CardPreview.vue')
)
const router = useRouter()
const props = defineProps(['list'])
const store = useCardStore()
</script>

<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1rem;
}
</style>
