<template>
  <span v-if="!isEditingTitle" @click="isEditingTitle = true">
    {{ title }}
  </span>

  <input
    v-else
    v-model.trim="editableTitle"
    v-focus="isEditingTitle"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const props = defineProps(['title'])
const editableTitle = ref('')
const isEditingTitle = ref(false)
const emit = defineEmits(['titleEdited'])

const handleBlur = () => {
  if (editableTitle.value) {
    emit('titleEdited', editableTitle.value)
  } else {
    editableTitle.value = props.title
  }
  isEditingTitle.value = false
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

<style scoped lang="scss">
// span {
// }

// input {
// }
</style>
