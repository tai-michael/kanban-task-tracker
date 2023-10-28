<template>
  <div>
    <ul>
      <li>{{ card.name }}</li>
      <li>{{ card.due_date }}</li>
      <li>{{ card.checklist_progress }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
const Card = defineAsyncComponent(() => import('@/components/CardPreview.vue'))

const props = defineProps(['card'])
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
