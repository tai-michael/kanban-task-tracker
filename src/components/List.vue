<template>
  <div class="flex justify-between gap-x-2 p-2 select-none my-handle">
    <Title
      :title="list.title"
      @is-editing-title="emitTitleState"
      @title-edited="changeListTitle"
      class="overflow-hidden overflow-ellipsis whitespace-nowrap font-bold py-1.5 pr-2 pl-3"
    />

    <EllipsisMenu
      :delete-button-label="deleteButtonLabel"
      :delete-confirmation-header="deleteConfirmationHeader"
      :delete-confirmation-body="deleteConfirmationBody"
      @delete-confirmed="store.deleteList(props.list.id)"
    />
  </div>

  <!-- FIXME sometimes, a card drags a sibling into the container (even tho either it or the sibling is not deleted, as discovered upon refresh). Probably need to record on shadowplay to discover cause -->
  <VueDraggable
    v-model="list.cards"
    v-bind="draggableOptions"
    class="space-y-3 list-cards"
    :class="{ 'increased-height': isCreatingCard, '!py-0': !list.cards.length }"
    @move="checkIfCardHoveringDeleteZone"
    @choose="updateCardHeldStatus(true)"
    @unchoose="updateCardHeldStatus(false)"
  >
    <div v-for="card in list.cards" :key="card.id">
      <CardPreview
        :card="card"
        @click="handleCardSelection(card.id)"
        class="cursor-pointer"
      />
    </div>

    <CardComposer
      v-if="isCreatingCard"
      :listId="list.id"
      :is-creating-card="isCreatingCard"
      @exit-card-composer="toggleCardComposer"
    />
  </VueDraggable>

  <div
    v-if="!isCreatingCard"
    class="pt-2 px-2"
    :class="{ 'pt-0': !list.cards.length }"
  >
    <button
      @click="toggleCardComposer"
      type="button"
      class="flex items-center gap-x-2 w-full py-2 pl-4 rounded-lg bg-transparent hover:bg-[var(--add-card-button)] active:bg-[var(--add-card-button)]"
    >
      <PlusIcon :color="'var(--medium-dark-gray)'" /><span
        class="font-medium text-[var(--medium-dark-gray)]"
        >Add a card</span
      >
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, inject, ref } from 'vue'
import Title from '@/components/Title.vue'
import EllipsisMenu from '@/components/EllipsisMenu.vue'
import CardComposer from '@/components/CardComposer.vue'
import PlusIcon from '@/assets/icons/icon-add.vue'
import useCardInteractionState from '@/composables/useCardInteractionState'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
import { VueDraggable } from 'vue-draggable-plus'
const CardPreview = defineAsyncComponent(
  () => import('@/components/CardPreview.vue')
)
const store = useBoardStore()
const router = useRouter()
const props = defineProps(['list'])

const deleteButtonLabel = 'Delete list'
const deleteConfirmationHeader = 'Delete this list?'
const deleteConfirmationBody = computed(() => {
  return `Are you sure you want to delete the ‘${props.list.title}’ list and
        its cards? This action cannot be reversed.`
})

const isCreatingCard = ref(false)
const toggleCardComposer = () => {
  isCreatingCard.value = !isCreatingCard.value
}

const isMobileView = inject('isMobileView')
const draggableOptions = computed(() => {
  return {
    group: 'cards',
    delayOnTouchOnly: true,
    delay: 200,
    animation: 150,
    fallbackTolerance: 3,
    revertOnSpill: true,
    forceFallback: true,
    scroll: true,
    scrollSensitivity: 90,
    bubbleScroll: true,
    chosenClass: isMobileView.value ? 'tilted' : '',
    dragClass: 'tilted',
    ghostClass: 'ghost',
    disabled: isCreatingCard.value,
  }
})

const emit = defineEmits(['isEditingTitle', 'cardSelected'])
const handleCardSelection = (cardId: string) => {
  emit('cardSelected')
  router.push(`/card/${cardId}`)
}

const emitTitleState = (isEditingTitle: boolean) => {
  emit('isEditingTitle', isEditingTitle)
}

const changeListTitle = (title: string) => {
  store.updateListTitle(props.list.id, title)
}

const { updateHoverDeleteZoneStatus, updateCardHeldStatus } =
  useCardInteractionState()
const checkIfCardHoveringDeleteZone = (evt) => {
  // console.log(evt.related)
  if (evt.related && evt.related.classList.contains('delete-zone')) {
    updateHoverDeleteZoneStatus(true)
  } else {
    updateHoverDeleteZoneStatus(false)
  }
}
</script>

<style scoped lang="scss">
.list-cards {
  margin: 0 4px;
  padding: 2px 4px;
  overflow-y: auto;
  overflow-x: clip;
  max-height: calc(100svh - (var(--header-height-mobile) * 2 + 5rem));
}

.increased-height {
  max-height: calc(100svh - (var(--header-height-mobile) * 2 + 2.05rem));
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
  // NOTE setting a width prevents scrollbar from disappearing in chrome devtools view
  width: 4px;
}

::-webkit-scrollbar-thumb {
  // background-color: rgba(0, 0, 0, 0.2);
  background-color: var(--scrollbar-thumb-color);
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

@media (min-width: 481px) {
  .list-cards {
    max-height: calc(100svh - (var(--header-height-desktop) * 2 + 3.5rem));
  }

  .increased-height {
    max-height: calc(100svh - (var(--header-height-desktop) * 2 + 0.55rem));
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background-color: var(--scrollbar-track-color);
  }
}
</style>
