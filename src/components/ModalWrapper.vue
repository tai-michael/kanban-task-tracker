<template>
  <dialog
    ref="dialog"
    class="rounded-md dark:bg-[var(--dark-gray)]"
    :class="[
      {
        [props.dialogClasses]: props.dialogClasses && visible,
        'box-shadow-heavy': visible,
      },
    ]"
    @mousedown="handleBackdropClick"
    @touchstart="handleBackdropClick"
    @close="visible = false"
  >
    <div
      class="dialog-content dark:bg-[var(--dark-gray)]"
      :class="[
        {
          [props.dialogContentClasses]: props.dialogContentClasses,
          grid: props.loading,
        },
      ]"
      @click.stop
    >
      <form
        v-if="visible"
        method="dialog"
        class="relative dark:bg-[var(--dark-gray)]"
        :class="{ [props.formClasses]: props.formClasses }"
      >
        <button
          v-if="props.showCloseButton"
          @click="handleCloseTriggered"
          type="button"
          aria-label="Close modal"
          class="absolute top-1 xs:top-2 right-2 z-10 flex justify-center items-center rounded-full hover:bg-[var(--icon-button-hover)] active:bg-[var(--icon-button-active)] transition-colors duration-100 w-10 h-10"
        >
          <CrossIcon />
        </button>

        <div
          v-if="props.loading"
          class="w-full h-full flex justify-center items-center"
        >
          <SpinnerCircle
            :spinner-classes="'flex w-14 h-14 border-4 border-[var(--main-purple-hover)]'"
          />
        </div>
        <slot />
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import CrossIcon from '@/assets/icons/icon-cross.vue'
import SpinnerCircle from '@/assets/spinner-circle.vue'

const dialog = ref<HTMLDialogElement>() // backdrop element
const props = defineProps({
  dialogClasses: {
    type: String,
    default: '',
  },
  dialogContentClasses: {
    type: String,
    default: '',
  },
  formClasses: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
  },
  showCloseButton: {
    type: Boolean,
  },
})

const visible = ref(false)

// A shown 'dialog' allow users to interact with non-dialog elements, while a 'modal' limits interaction to the modal's contents
const showDialog = () => {
  dialog.value?.show()
  visible.value = true
}
const showModal = () => {
  dialog.value?.showModal()
  visible.value = true
}

const close = (returnVal?: string) => {
  dialog.value?.close(returnVal)
  visible.value = false
}

// Allows further handling in parent, like route changes
const emit = defineEmits(['closeTriggered'])
const handleCloseTriggered = () => {
  close()
  emit('closeTriggered')
}

const handleBackdropClick = (event: MouseEvent | TouchEvent) => {
  // Closes dialog if backdrop element is clicked/pressed
  if (event.target === dialog.value) {
    event.preventDefault()
    close()
    emit('closeTriggered')
  }
}

const handleEscapePressed = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) {
    emit('closeTriggered')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapePressed)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapePressed)
})

defineExpose({
  showDialog,
  showModal,
  close,
  visible,
})
</script>

<style scoped lang="scss">
dialog {
  // display: grid;
  position: fixed;
  inset: 0;
  margin: auto;
  outline: none;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
