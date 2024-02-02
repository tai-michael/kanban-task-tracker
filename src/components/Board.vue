<template>
  <!-- NOTE using optional chaining on the v-model breaks the wrapper -->
  <div class="flex px-4">
    <VueDraggable
      v-model="store.board.lists"
      ref="listsEl"
      group="lists"
      :animation="150"
      drag-class="drag"
      ghost-class="ghost"
      class="flex gap-x-4"
    >
      <div
        v-for="list in store.board.lists"
        :key="list.id"
        class="min-w-[304px] border rounded pb-2 h-fit"
      >
        <List :list="list" @card-selected="$emit('card-selected')"></List>
      </div>
    </VueDraggable>

    <ListComposer />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'
import { useBoardStore } from '@/stores'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
// import draggable from 'vuedraggable'
import { VueDraggable } from 'vue-draggable-plus'

const List = defineAsyncComponent(() => import('@/components/List.vue'))
const ListComposer = defineAsyncComponent(
  () => import('@/components/ListComposer.vue')
)
const store = useBoardStore()

watch(
  () => store.board,
  () => {
    // NOTE debounce defaults to true here in case of rapid dragging and dropping of cards
    updateFirestoreDoc('boards_single', store.board.id, store.board)
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.drag > * {
  transform: rotate(3deg);
}

.ghost {
  background-color: rgb(226, 226, 226);
  border-radius: 8px;
}

// .ghost > * {
//   // visibility: hidden;
//   opacity: 0.2;
// }
</style>
