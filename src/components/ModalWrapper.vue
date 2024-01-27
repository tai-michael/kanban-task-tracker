<template>
  <dialog
    ref="dialog"
    class="rounded-lg"
    @click="handleBackdropClick"
    @close="visible = false"
  >
    <div class="dialog-content" @click.stop>
      <form
        v-if="visible"
        method="dialog"
        class="relative"
        :class="{ [props.classes]: props.classes }"
      >
        <!-- TODO replace with spinner -->
        <div v-if="props.loading">Loading...</div>

        <div v-else>
          <button
            v-if="props.showCloseButton"
            @click="handleCloseTriggered"
            type="button"
            aria-label="Close modal"
            class="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-[var(--icon-button-hover)] active:bg-[var(--icon-button-active)] transition-colors duration-100"
          >
            <img :src="CrossIcon" />
          </button>
          <slot />
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'

const dialog = ref<HTMLDialogElement>() // backdrop element
const props = defineProps({
  classes: {
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

const handleBackdropClick = (event) => {
  // Closes dialog if backdrop element is clicked
  if (event.target === dialog.value) {
    close()
    emit('closeTriggered')
  }
}

const handleEscapePress = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) {
    emit('closeTriggered')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapePress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapePress)
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
  display: grid;
  position: fixed;
  inset: 0;
  margin: auto;
  box-shadow: var(--box-shadow-heavy);
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
