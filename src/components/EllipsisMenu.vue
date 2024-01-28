<template>
  <div class="flex shrink-0 w-10 h-10 relative">
    <button
      @click="toggleEllipsisMenu"
      :class="['icon-button', { 'icon-button--selected': isEllipsisMenuOpen }]"
    >
      <img
        :src="EllipsisIcon"
        class="w-[3.7px] h-[16px] xs:w-[5px] xs:h-[20px]"
      />
    </button>

    <div v-if="isEllipsisMenuOpen">
      <div class="backdrop" @click="toggleEllipsisMenu"></div>

      <div class="ellipsis-popover">
        <div @click="toggleModal" class="ellipsis-popover__button">
          <DeleteIcon />
          <button type="button" class="select-none">Delete Board</button>
        </div>
        <!-- <button class="ellipsis-popover__button">Change Title</button> -->
      </div>
    </div>
  </div>

  <ModalWrapper ref="modal" :show-close-button="true">
    <div
      class="flex flex-col gap-y-6 xs:max-w-[480px] xs:w-full p-6 xs:px-8 xs:pt-8 xs:pb-10"
    >
      <h2 class="text-lg font-bold select-none text-[#EA5555]">
        Delete this board?
      </h2>
      <span class="font-medium text-sm text-[var(--medium-gray)] leading-6"
        >Are you sure you want to delete the ‘{{ boardStore.board?.title }}’
        board? This action will remove all lists and cards and cannot be
        reversed.</span
      >
      <div class="flex gap-x-4 gap-y-4 flex-wrap xs:flex-nowrap">
        <button
          @click="toggleModal"
          type="button"
          class="button-shared text-[var(--main-purple)] bg-[var(--light-purple)] hover:bg-[var(--icon-button-hover)] active:bg-[var(--icon-button-active)]"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleDeleteBoard"
          class="button-shared text-white bg-red-500 hover:bg-red-400 active:bg-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import EllipsisIcon from '@/assets/icons/icon-vertical-ellipsis.svg'
import DeleteIcon from '@/assets/icons/icon-delete.vue'
import { useBoardStore } from '@/stores'
const ModalWrapper = defineAsyncComponent(
  () => import('@/components/ModalWrapper.vue')
)
const boardStore = useBoardStore()

const isEllipsisMenuOpen = ref(false)
const toggleEllipsisMenu = () => {
  isEllipsisMenuOpen.value = !isEllipsisMenuOpen.value
}

const modal = ref<InstanceType<typeof ModalWrapper>>()
const toggleModal = () => {
  if (isEllipsisMenuOpen.value) toggleEllipsisMenu()

  if (modal.value?.visible) modal.value?.close()
  else modal.value?.showModal()
}

const handleDeleteBoard = () => {
  boardStore.deleteBoard()
  toggleEllipsisMenu()
  // TODO add toast or something similar
}
</script>

<style scoped lang="scss">
.button-shared {
  @apply py-2 px-4 rounded-[20px] select-none font-medium text-sm leading-6 w-full;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}

.ellipsis-popover {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  overflow: hidden;

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.5rem;
    flex-grow: 1;
    padding: 1rem;
    background-color: white;
    border: none;
    cursor: pointer;

    &:not(:last-child) {
      border-bottom: 1px solid theme('colors.gray.300');
    }

    &:first-child {
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
    }

    &:last-child {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  }

  &__button:active,
  &__button:hover {
    background-color: var(--light-purple);
  }
}
</style>
