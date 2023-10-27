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
const Card = defineAsyncComponent(() => import('@/components/Card.vue'))

const props = defineProps(['card'])
</script>

<style scoped lang="scss">
ul {
  background: #73b2f1;
  padding: 8px;
}
li {
  font-style: italic;
}
</style>
