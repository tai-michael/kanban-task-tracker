<template>
  <div class="flex shrink-0 w-10 h-10 relative">
    <button
      @click="toggleEllipsisMenu"
      :class="['icon-button', { 'icon-button--selected': isEllipsisMenuOpen }]"
    >
      <img :src="EllipsisIcon" class="w-[20px] h-[20px]" />
    </button>

    <div v-if="isEllipsisMenuOpen">
      <div class="backdrop" @click="toggleEllipsisMenu"></div>

      <div class="ellipsis-popover">
        <div @click="toggleModal" class="ellipsis-popover__button">
          <DeleteIcon />
          <button type="button" class="select-none">
            {{ props.deleteButtonLabel }}
          </button>
        </div>
        <!-- <button class="ellipsis-popover__button">Change Title</button> -->
      </div>
    </div>
  </div>

  <!-- NOTE the w-85vw is necessary to expand the form to the extent of the max-w before the form's content loads in (there is a delay for whatever reason). The '85' also essentially provides dynamic margins in mobile view -->
  <ModalWrapper
    ref="modal"
    :show-close-button="true"
    :form-classes="'flex flex-col gap-y-6 w-[85vw] xs:max-w-[480px] min-h-[260px] xs:min-h-[236px] p-6 xs:px-8 xs:pt-8 xs:pb-10'"
  >
    <DeleteConfirmation
      @cancel-triggered="toggleModal"
      @delete-triggered="handleDeleteBoard"
    >
      <template #header>{{ props.deleteConfirmationHeader }}</template>
      <template #body> {{ props.deleteConfirmationBody }}</template>
    </DeleteConfirmation>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import EllipsisIcon from '@/assets/icons/icon-horizontal-ellipsis.svg'
import DeleteIcon from '@/assets/icons/icon-delete.vue'
import useEllipsisMenuState from '@/composables/useEllipsisMenuState'
const ModalWrapper = defineAsyncComponent(
  () => import('@/components/ModalWrapper.vue')
)
const DeleteConfirmation = defineAsyncComponent(
  () => import('@/components/DeleteConfirmation.vue')
)
const props = defineProps([
  'deleteButtonLabel',
  'deleteConfirmationHeader',
  'deleteConfirmationBody',
])
const { updateEllipsisMenuStatus } = useEllipsisMenuState()

const isEllipsisMenuOpen = ref(false)
const toggleEllipsisMenu = () => {
  isEllipsisMenuOpen.value = !isEllipsisMenuOpen.value
  // NOTE prevents list from being draggable while ellipsis menu's open
  updateEllipsisMenuStatus(isEllipsisMenuOpen.value)
}

const modal = ref<InstanceType<typeof ModalWrapper>>()
const toggleModal = () => {
  if (isEllipsisMenuOpen.value) toggleEllipsisMenu()

  if (modal.value?.visible) modal.value?.close()
  else modal.value?.showModal()
}

const emit = defineEmits(['deleteConfirmed'])
const handleDeleteBoard = () => {
  emit('deleteConfirmed')
  toggleEllipsisMenu()
  // REVIEW maybe add toast for this, though probably unnecessary
}
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-backdrop);
}

.ellipsis-popover {
  position: absolute;
  top: 110%;
  right: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: var(--box-shadow-heavy);
  z-index: var(--z-popover);
  overflow: clip;

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
