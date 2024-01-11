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
        :class="{ [props.classes]: props.classes }"
      >
        <button type="button" @click="handleCloseClicked">Close</button>
        <slot />
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const emit = defineEmits([
  'closeTriggered',
  'backdropDismissed',
  'escapePressed',
])

const dialog = ref<HTMLDialogElement>() // backdrop element

const props = defineProps({
  classes: {
    type: String,
    default: '',
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

const handleCloseClicked = () => {
  close()
  // These emits allow further handling in parent, like route changes
  emit('closeTriggered')
}

const handleBackdropClick = (event) => {
  // Closes dialog if backdrop element is clicked
  if (event.target === dialog.value) {
    close()
    emit('backdropDismissed')
  }
}

const handleEscapePress = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) {
    emit('escapePressed')
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
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
