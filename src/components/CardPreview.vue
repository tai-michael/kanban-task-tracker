<template>
  <div v-if="isCreatingCard">
    <input
      v-model="newCardTitle"
      v-focus="isCreatingCard"
      @blur="$emit('create-card', newCardTitle)"
      placeholder="Add a title for this card"
    />
  </div>

  <div v-else>
    <ul>
      <li>{{ card.title }}</li>
      <li>{{ card.due_date }}</li>
      <li>{{ card.checklist_progress }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
const Card = defineAsyncComponent(() => import('@/components/CardPreview.vue'))
const props = defineProps({
  card: {
    type: Object,
    default: () => ({}),
    required: false,
  },
  isCreatingCard: Boolean,
})
const newCardTitle = ref('')
</script>

<style scoped lang="scss">
ul {
  padding: 8px 12px 4px;
  margin: 8px 4px;
  background: #73b2f1;
  border: black 1px solid;
  border-radius: 8px;
  min-height: 24px;
}

li {
  font-style: italic;
}
</style>
