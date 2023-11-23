<template>
  <span v-if="!isEditingTitle" @click="isEditingTitle = true">
    {{ title }}
  </span>

  <input v-else v-model="title" v-focus="isEditingTitle" @blur="changeTitle" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps(['title'])
const title = ref('')
const isEditingTitle = ref(false)
const emit = defineEmits(['titleEdited'])

const changeTitle = () => {
  emit('titleEdited', title.value)
  isEditingTitle.value = false
}

onMounted(() => {
  title.value = props.title
})
</script>

<style scoped lang="scss">
span {
}

input {
}
</style>
