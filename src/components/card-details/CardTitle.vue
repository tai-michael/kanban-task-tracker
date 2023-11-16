<template>
  <li v-if="!isEditingTitle" @click="isEditingTitle = true">
    {{ store.cardSummary.title }}
  </li>

  <input
    v-else
    v-model="cardTitle"
    v-focus="isEditingTitle"
    @blur="changeCardTitle"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCardStore } from '@/stores'
const store = useCardStore()
const cardTitle = ref('')
const isEditingTitle = ref(false)

const changeCardTitle = () => {
  store.updateCardTitle(cardTitle.value)
  isEditingTitle.value = false
}

onMounted(() => {
  cardTitle.value = store.cardSummary.title
})
</script>

<style scoped lang="scss"></style>
