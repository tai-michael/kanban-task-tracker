<template>
  <div class="flex" :class="store.board.lists.length ? 'px-4' : 'px-0'">
    <!-- NOTE using optional chaining on the v-model breaks the wrapper -->
    <VueDraggable
      v-model="store.board.lists"
      v-bind="draggableOptions"
      class="lists-container flex gap-x-4"
      @choose="updateListHeldStatus(true)"
      @unchoose="updateListHeldStatus(false)"
    >
      <div
        v-for="list in store.board.lists"
        :key="list.id"
        class="w-[304px] h-fit rounded pb-2 xs:snap-align-none bg-[var(--list-bg)] box-shadow-light"
        :class="{ 'snap-center': !isListHeld }"
      >
        <div class="list-container">
          <List :list="list" @card-selected="$emit('card-selected')"></List>
        </div>
      </div>
    </VueDraggable>

    <div
      class="list-composer-container xs:snap-align-none"
      :class="{ 'snap-center': !isListHeld }"
    >
      <ListComposer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useBoardStore } from '@/stores'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import useEllipsisMenuState from '@/composables/useEllipsisMenuState'
import { VueDraggable } from 'vue-draggable-plus'
const List = defineAsyncComponent(() => import('@/components/List.vue'))
const ListComposer = defineAsyncComponent(
  () => import('@/components/ListComposer.vue')
)
const store = useBoardStore()

const isListHeld = ref(false)
const updateListHeldStatus = (isHeld: boolean) => {
  isListHeld.value = isHeld
}

const { isEllipsisMenuActive } = useEllipsisMenuState()
const draggableOptions = computed(() => {
  return {
    group: 'lists',
    delay: 200,
    delayOnTouchOnly: true,
    forceFallback: true, // allows horizontal scrolling while dragging
    scrollSensitivity: 110,
    fallbackTolerance: 5,
    handle: '.my-handle',
    dragClass: 'tilted',
    ghostClass: 'ghost',
    disabled: isEllipsisMenuActive.value ? true : false,
    // chosenClass: 'tilted', // REVIEW this doesn't work because of some strange interaction with scroll-snap
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
.tilted {
  transform: rotate(3deg);

  .list-container {
    // NOTE nested components also rotate once more when when the list is dragged, so this is needed to prevent that
    transform: unset;
  }
}

.ghost {
  background-color: rgb(226, 226, 226);
  border-radius: 4px;
}

.dark .ghost {
  background-color: hsla(235, 12%, 19%, 20%);
}

.ghost > * {
  // visibility: hidden;
  opacity: 0.2;
}

.dark .ghost > * {
  opacity: 0.1;
}
</style>
