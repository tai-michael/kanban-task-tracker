<template>
  <header :class="isCardHeld ? 'px-0' : 'px-1.5'">
    <div
      v-if="route.name === 'home' && isMobileView"
      class="flex justify-between gap-x-2"
    >
      <div v-if="!searchStore.isSearching" class="flex items-center gap-x-2">
        <NarrowscreenMenu />
        <span class="font-bold text-lg dark:text-white">Boards</span>
      </div>

      <BoardSearch v-if="boardStore.boards?.length > 0" />
    </div>

    <div
      v-else-if="route.name === 'board' || route.name === 'card'"
      class="flex h-full items-center justify-center transition-colors duration-100 ease-in-out"
      :class="{
        'bg-[var(--delete-zone)]': isCardHeld && isHoveringDeleteZone,
      }"
    >
      <div
        v-if="
          Object.keys(boardStore.board).length && (!isMobileView || !isCardHeld)
        "
        class="flex w-full items-center gap-x-3"
      >
        <div class="flex shrink-0 w-10 h-10 xs:hidden">
          <button
            @click="handleReturnToBoards"
            type="button"
            class="icon-button"
          >
            <BackArrowIcon class="w-8 h-8" />
          </button>
        </div>

        <Title
          :title="boardStore.board.title"
          @title-edited="changeBoardTitle"
          class="title"
        />

        <EllipsisMenu
          :delete-button-label="deleteButtonLabel"
          :delete-confirmation-header="deleteConfirmationHeader"
          :delete-confirmation-body="deleteConfirmationBody"
          @delete-confirmed="boardStore.deleteBoardAndCleanup"
        />
      </div>

      <VueDraggable
        v-if="isCardHeld && isMobileView"
        v-model="deleteZone"
        :group="deleteOptions"
        @add="updateHoverDeleteZoneStatus(false)"
        ghost-class="ghost"
        class="delete-container"
      >
        <div class="delete-zone">
          <DeleteIcon
            class="text-[var(--very-dark-red)] dark:text-white"
          /><span class="text-[var(--very-dark-red)] dark:text-white"
            >Drag here to delete</span
          >
        </div>
      </VueDraggable>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import Title from '@/components/Title.vue'
import BoardSearch from '@/components/BoardSearch.vue'
import NarrowscreenMenu from '@/components/NarrowscreenMenu.vue'
import BackArrowIcon from '@/assets/icons/icon-arrow-back.vue'
import EllipsisMenu from '@/components/EllipsisMenu.vue'
import DeleteIcon from '@/assets/icons/icon-delete.vue'
import { useBoardStore, useSearchStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import useCardInteractionState from '@/composables/useCardInteractionState'
import { VueDraggable } from 'vue-draggable-plus'
const isMobileView = inject('isMobileView')
const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const searchStore = useSearchStore()
const emit = defineEmits(['boardSelectorTriggered'])

const changeBoardTitle = (title: string) => {
  boardStore.updateBoardTitle(title)
}

const deleteButtonLabel = 'Delete board'
const deleteConfirmationHeader = 'Delete this board?'
const deleteConfirmationBody = computed(() => {
  return `Are you sure you want to delete the ‘${boardStore.board?.title}’ board? This action will remove all lists and cards and cannot be reversed.`
})

const handleReturnToBoards = () => {
  router.push({ name: 'home' })
  if (isMobileView.value) boardStore.clearBoard()
}

const { isCardHeld, isHoveringDeleteZone, updateHoverDeleteZoneStatus } =
  useCardInteractionState()

const deleteZone = ref([])
const deleteOptions = computed(() => {
  return {
    name: 'trash',
    // draggable: '.dropitem',
    put: () => true,
    pull: false,
  }
})
</script>

<style scoped lang="scss">
header {
  position: sticky;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: var(--header-height-mobile);
  background-color: var(--header-color);
  z-index: var(--z-header);
  border-bottom: 1px solid var(--border);
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 700;
}

@media (min-width: 481px) {
  header {
    height: var(--header-height-desktop);
    padding-left: 24px;
    padding-right: 16px;
  }

  .title {
    font-size: 24px;
  }
}

.delete-container {
  position: relative;
  height: 60%;
  width: 80%;
  background-color: var(--delete-zone);
  border-radius: 4px;
}

.delete-zone {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.5rem;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
