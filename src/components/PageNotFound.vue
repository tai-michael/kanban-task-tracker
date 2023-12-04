<template>
  <div class="text-center">
    <h1 class="font-bold text-2xl mb-4">Page not found</h1>
    <span class="text-lg">{{ errMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useErrorStore } from '@/stores'
const store = useErrorStore()
const errMessage = computed(
  () =>
    store.errorMessage ||
    'The link you entered does not look like a valid Kanban link'
)
</script>

<style scoped lang="scss"></style>
