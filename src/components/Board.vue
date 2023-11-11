<template>
  <div>
    <h1>{{ store.board.name }}</h1>

    <draggable
      v-model="store.board.lists"
      item-key="id"
      group="lists"
      :animation="150"
      ghost-class="ghost"
      class="flex-container"
    >
      <template #item="{ element: list }">
        <div class="w-[372px]">
          <List :list="list"></List>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, watch } from 'vue'
import { useBoardStore } from '@/stores'
import useUpdateFirestoreDoc from '@/composables/useUpdateFirestoreDoc'
import draggable from 'vuedraggable'
const List = defineAsyncComponent(() => import('@/components/List.vue'))
const store = useBoardStore()
const isInitialLoad = ref(true)

watch(
  () => store.board,
  () => {
    // flag needed to avoid triggering watcher when board is initially fetched from backend
    if (isInitialLoad.value) {
      isInitialLoad.value = false
      return
    }
    useUpdateFirestoreDoc('boards_single', store.board.id, store.board)
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1.5rem;
}
.flex-container {
  display: flex;
  flex-direction: row; /* Align children in a row */
  gap: 20px; /* Optional: add some space between columns */
}

.ghost {
  background-color: rgb(226, 226, 226);
  border-radius: 8px;
}

.ghost > div {
  visibility: hidden;
}
</style>
@/composables/useUpdateFirestoreDoc
