<template>
  <!-- NOTE using optional chaining on the v-model breaks the wrapper -->
  <div class="flex px-4">
    <VueDraggable
      v-model="store.board.lists"
      v-bind="draggableOptions"
      class="lists-container flex gap-x-4"
    >
      <div
        v-for="list in store.board.lists"
        :key="list.id"
        class="w-[304px] h-fit border-2 rounded pb-2 snap-center xs:snap-align-none"
      >
        <List :list="list" @card-selected="$emit('card-selected')"></List>
      </div>
    </VueDraggable>

    <div class="list-composer-container snap-center xs:snap-align-none">
      <ListComposer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, watch } from 'vue'
import { useBoardStore } from '@/stores'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import { VueDraggable } from 'vue-draggable-plus'

const List = defineAsyncComponent(() => import('@/components/List.vue'))
const ListComposer = defineAsyncComponent(
  () => import('@/components/ListComposer.vue')
)
const store = useBoardStore()

const draggableOptions = computed(() => {
  return {
    group: 'lists',
    delay: 200,
    delayOnTouchOnly: true,
    animation: 150,
    handle: '.my-handle',
    dragClass: 'tilted',
    ghostClass: 'ghost',
  }
})

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
.tilted > * {
  transform: rotate(3deg);
}

.ghost {
  background-color: rgb(226, 226, 226);
  border-radius: 8px;
}

.ghost > * {
  // visibility: hidden;
  opacity: 0.2;
}
</style>
