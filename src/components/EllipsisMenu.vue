<template>
  <div class="flex shrink-0 w-10 h-10 relative">
    <button
      @mousedown="toggleEllipsisMenu"
      :class="['icon-button', { 'icon-button--selected': isEllipsisMenuOpen }]"
    >
      <EllipsisIcon class="w-[20px] h-[20px]" />
    </button>

    <div
      v-if="isEllipsisMenuOpen"
      class="backdrop"
      @mousedown="toggleEllipsisMenu"
    ></div>

    <TransitionFade>
      <div v-if="isEllipsisMenuOpen">
        <div
          class="ellipsis-popover"
          :class="{ [popoverClasses]: props.popoverClasses }"
        >
          <button
            v-if="props.deleteButtonLabel"
            @mousedown="toggleModal"
            type="button"
            class="ellipsis-popover__button"
          >
            <DeleteIcon class="text-[var(--light-red)]" />
            <label class="text-[var(--light-red)] font-medium">
              {{ props.deleteButtonLabel }}
            </label>
          </button>
          <!-- <button class="ellipsis-popover__button">Change Title</button> -->
          <slot name="custom-buttons"></slot>
        </div>
      </div>
    </TransitionFade>
  </div>

  <!-- NOTE the w-85vw is necessary to expand the form to the extent of the max-w before the form's content loads in (there is a delay for whatever reason). The '85' also essentially provides dynamic margins in mobile view -->
  <ModalWrapper
    ref="modal"
    :show-close-button="true"
    :form-classes="'flex flex-col gap-y-6 w-[85vw] xs:max-w-[480px] min-h-[268px] xs:min-h-[236px] p-6 xs:px-8 xs:pt-8 xs:pb-10'"
  >
    <DeleteConfirmation
      @cancel-triggered="toggleModal"
      @delete-triggered="handleDelete"
    >
      <template #header>{{ props.deleteConfirmationHeader }}</template>
      <template #body> {{ props.deleteConfirmationBody }}</template>
    </DeleteConfirmation>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, watch } from 'vue'
import EllipsisIcon from '@/assets/icons/icon-horizontal-ellipsis.vue'
import DeleteIcon from '@/assets/icons/icon-delete.vue'
import TransitionFade from '@/components/transitions/TransitionFade.vue'
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
  'popoverClasses',
])
const { updateEllipsisMenuStatus } = useEllipsisMenuState()

const isEllipsisMenuOpen = ref(false)
const toggleEllipsisMenu = () => {
  isEllipsisMenuOpen.value = !isEllipsisMenuOpen.value
  // NOTE prevents list from being draggable while ellipsis menu's open
  updateEllipsisMenuStatus(isEllipsisMenuOpen.value)
}
defineExpose({
  toggleEllipsisMenu, // Useful in case custom buttons are used
})

const modal = ref<InstanceType<typeof ModalWrapper>>()
const toggleModal = () => {
  if (isEllipsisMenuOpen.value) toggleEllipsisMenu()

  if (modal.value?.visible) modal.value?.close()
  else modal.value?.showModal()
}

const emit = defineEmits(['deleteConfirmed'])
const handleDelete = () => {
  emit('deleteConfirmed')
  // REVIEW maybe add toast for this, though probably unnecessary
}

const handleEscapePressed = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isEllipsisMenuOpen.value) {
    toggleEllipsisMenu()
    event.preventDefault()
  }
}
watch(
  () => isEllipsisMenuOpen.value,
  (newValue) => {
    if (newValue) {
      document.addEventListener('keydown', handleEscapePressed)
    } else {
      document.removeEventListener('keydown', handleEscapePressed)
    }
  }
)
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
</style>
