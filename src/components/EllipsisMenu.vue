<template>
  <div class="flex shrink-0 w-10 h-10 relative">
    <button
      @click="toggleEllipsisMenu"
      type="button"
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
        <button @click="toggleModal" type="button">Delete Board</button>
        <!-- <button>Change Title</button> -->
      </div>
    </div>
  </div>

  <ModalWrapper
    ref="modal"
    :show-close-button="true"
    :classes="'px-6 py-5 w-[260px] xs:w-[270px]'"
  >
    <div class="flex flex-col gap-y-7">
      <span class="text-lg font-semibold select-none">Delete this board?</span>
      <div class="self-end">
        <button
          @click="toggleModal"
          type="button"
          class="mr-2 py-2 px-4 rounded select-none hover:bg-slate-100 active:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleDeleteBoard"
          class="py-2 px-4 rounded select-none text-white bg-red-500 hover:bg-red-400 active:bg-red-600"
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

  button {
    flex-grow: 1;
    padding: 1rem;
    background-color: white;
    border: none;
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

  button:active {
    background-color: var(--light-nav-hover);
  }
}
</style>
