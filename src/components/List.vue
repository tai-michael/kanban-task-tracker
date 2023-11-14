<template>
  <h2>{{ list.title }}</h2>

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
</script>

<style scoped lang="scss">
h2 {
  font-weight: 600;
  font-size: 1rem;
  margin-left: 0.5rem;
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
}
</style>
