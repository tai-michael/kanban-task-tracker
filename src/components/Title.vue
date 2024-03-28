<template>
  <span
    v-if="!isEditingTitle"
    @click="toggleEditState"
    class="cursor-pointer w-full text-[var(--title-color)]"
  >
    {{ title }}
  </span>

  <input
    v-else
    ref="titleInput"
    v-model.trim="editableTitle"
    v-focus="isEditingTitle"
    @focus="setTitle"
    @keydown.enter.prevent="handleSubmit"
    @blur="handleSubmit"
    @keydown.esc.prevent="cancelEditingTitle"
    class="w-full px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-[var(--main-purple)]"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const props = defineProps(['title'])
const titleInput = ref()
const editableTitle = ref('')
const isEditingTitle = ref(false)
const toggleEditState = () => (isEditingTitle.value = !isEditingTitle.value)

const emit = defineEmits(['titleEdited'])
const handleSubmit = () => {
  if (!isEditingTitle.value) return

  if (editableTitle.value) {
    emit('titleEdited', editableTitle.value)
  } else {
    editableTitle.value = props.title
  }
  toggleEditState()
}

const cancelEditingTitle = () => {
  editableTitle.value = ''
  toggleEditState()
}

const setTitle = () => {
  // NOTE canceling an edit clears the description, so this is a workaround
  if (editableTitle.value) return
  editableTitle.value = props.title

  titleInput.value.select() // Select all text in the input element
}

onMounted(() => {
  editableTitle.value = props.title
})

watch(
  () => props.title,
  (newValue) => {
    editableTitle.value = newValue
  }
)
</script>

<style scoped lang="scss"></style>
