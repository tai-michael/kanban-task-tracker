<template>
  <div class="flex justify-between p-2 select-none my-handle">
    <Title :title="list.title" @title-edited="changeListTitle" />
    <button
      @click="store.removeList(props.list.id)"
      type="button"
      class="bg-red-400 shrink-0"
    >
      Delete List
    </button>
  </div>

  <!-- TODO place these inside computed -->
  <VueDraggable
    v-model="list.cards"
    group="cards"
    :delay="200"
    :delay-on-touch-only="true"
    :animation="150"
    :fallback-tolerance="3"
    :revert-on-spill="true"
    :force-fallback="true"
    :scroll="true"
    :scroll-sensitivity="90"
    :bubble-scroll="true"
    :chosen-class="isMobileView ? 'tilted' : ''"
    drag-class="tilted"
    ghost-class="ghost"
    class="space-y-3 list-cards"
    @move="checkIsCardHoveringOverDeleteZone"
    @choose="store.setCardHoldingStatus(true)"
    @unchoose="store.setCardHoldingStatus(false)"
  >
    <div v-for="card in list.cards" :key="card.id">
      <CardPreview
        :card="card"
        @click="handleCardSelection(card.id)"
        class="cursor-pointer"
      />
    </div>
  </VueDraggable>

  <div class="px-2 pt-2 select-none">
    <CardComposer :listId="list.id" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject, ref } from 'vue'
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
const isMobileView = inject('isMobileView')
const emit = defineEmits(['cardSelected'])

const handleCardSelection = (cardId: string) => {
  emit('cardSelected')
  router.push(`/card/${cardId}`)
}

const changeListTitle = (title: string) => {
  store.updateListTitle(props.list.id, title)
}

const checkIsCardHoveringOverDeleteZone = (evt) => {
  // console.log(evt.related)
  if (evt.related && evt.related.classList.contains('delete-zone')) {
    store.setCardHoverStatus(true)
  } else {
    store.setCardHoverStatus(false)
  }
}
</script>

<style scoped lang="scss">
.list-cards {
  margin: 0 4px;
  padding: 2px 4px;
  overflow-y: auto;
  overflow-x: clip;
  max-height: calc(100svh - (var(--header-height-mobile) * 2 + 3rem));
}

.tilted > * {
  transform: rotate(3deg);
}

.ghost {
  // background-color: rgb(216, 216, 216);
  border-radius: 8px;
}

.ghost > * {
  // visibility: hidden;
  opacity: 0.2;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

@media (min-width: 481px) {
  .list-cards {
    @media (min-width: 481px) {
      max-height: calc(100svh - (var(--header-height-desktop) * 2 + 1.5rem));
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background-color: #091e420f;
  }
}
</style>
