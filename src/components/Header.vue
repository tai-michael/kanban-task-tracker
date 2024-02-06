<template>
  <header :class="isCardHeld ? 'px-0' : 'px-1.5'">
    <div
      v-if="route.name === 'home'"
      class="flex justify-between gap-x-2 xs:hidden"
    >
      <div v-if="!searchStore.isSearching" class="flex items-center gap-x-2">
        <!-- TODO Add sidebar for hamburger menu (including slide in and out transitions; menu should have user profile button and darkmode toggle. Not sure what else.) -->
        <div class="flex w-10 h-10">
          <button @click="toggleMenu" type="button" class="icon-button">
            <MenuIcon :fill="'black'" class="w-7 h-7" />
          </button>
        </div>

        <div v-if="isOpen" @click="toggleMenu" class="overlay"></div>

        <TransitionFadeAndSlide>
          <div v-if="isOpen" class="hamburger-menu">
            <button
              @click="toggleMenu"
              class="absolute right-5 top-5 py-1 px-4 bg-slate-400"
            >
              X
            </button>
            <ul>
              <li>Toggle darkmode</li>
              <li>Sign out</li>
            </ul>
          </div>
        </TransitionFadeAndSlide>

        <span class="font-bold text-lg">Boards</span>
      </div>

      <BoardSearch v-if="boardStore.boards?.length > 0" />
    </div>

    <div
      v-else-if="route.name === 'board' || route.name === 'card'"
      class="flex h-full items-center justify-center transition-colors duration-100 ease-in-out"
      :class="{
        'bg-[hsla(0,100%,80%)]': isCardHeld && isHoveringDeleteZone,
      }"
    >
      <div
        v-if="!isCardHeld || !isMobileView"
        class="flex w-full items-center gap-x-3"
      >
        <div class="flex shrink-0 w-10 h-10 xs:hidden">
          <button
            @click="handleReturnToBoards"
            type="button"
            class="icon-button"
          >
            <BackArrowIcon :color="'black'" class="w-8 h-8" />
          </button>
        </div>

        <Title
          v-if="boardStore.board?.title"
          :title="boardStore.board.title"
          @title-edited="changeBoardTitle"
          class="title"
        />

        <EllipsisMenu v-if="Object.keys(boardStore.board).length" />
      </div>

      <VueDraggable
        v-if="isCardHeld && isMobileView"
        v-model="deleteZone"
        :group="deleteOptions"
        ghost-class="ghost"
        class="delete-container"
      >
        <div class="delete-zone">
          <DeleteIcon /><span>Drag here to delete</span>
        </div>
      </VueDraggable>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Title from '@/components/Title.vue'
import BoardSearch from '@/components/BoardSearch.vue'
import TransitionFadeAndSlide from '@/components/transitions/TransitionFadeAndSlide.vue'
import MenuIcon from '@/assets/icons/icon-menu.vue'
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

const isOpen = ref(false)
const toggleMenu = () => {
  isOpen.value = !isOpen.value
  // console.log(isOpen.value)
}

const changeBoardTitle = (title: string) => {
  boardStore.updateBoardTitle(title)
}

const handleReturnToBoards = () => {
  router.push({ name: 'home' })
  if (isMobileView.value) boardStore.clearBoard()
}

const { isCardHeld, isHoveringDeleteZone } = useCardInteractionState()

const deleteZone = []
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
  margin-bottom: 0.75rem;
  background-color: white;
}

.hamburger-menu {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  padding: 3rem;
  width: 50vh;
  height: 100vh;
  z-index: 999999;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(177, 177, 177);
  opacity: 0.25;
  height: 100vh;
  width: 100vh;
  z-index: 50;
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
    padding: 0 16px;
  }

  .title {
    font-size: 24px;
  }
}

.delete-container {
  background-color: hsla(0, 100%, 80%);
  height: 60%;
  width: 80%;
  position: relative;
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
