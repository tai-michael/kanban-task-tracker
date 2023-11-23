<template>
  <div>
    <Title
      v-if="store.board.title"
      :title="store.board.title"
      @title-edited="changeBoardTitle"
    />

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
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import draggable from 'vuedraggable'
import Title from '@/components/Title.vue'
const List = defineAsyncComponent(() => import('@/components/List.vue'))
const store = useBoardStore()
const props = defineProps(['title'])
const isInitialLoad = ref(true)
const changeBoardTitle = (title: string) => {
  store.updateBoardTitle(title)
}

watch(
  () => store.board,
  () => {
    console.log('triggered board watcher')
    // avoids triggering watcher when board is initially fetched from backend
    if (isInitialLoad.value) {
      isInitialLoad.value = false
      return
    }
    updateFirestoreDoc('boards_single', store.board.id, store.board, true)
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
