<template>
  <div class="text-center flex flex-col items-center p-2">
    <h1 class="font-bold text-2xl mb-4">Page not found</h1>
    <span class="text-lg mb-4">{{ errMessage }}</span>
    <button @click="router.push('/')" class="p-1.5 bg-blue-300 rounded">
      Home
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores'
const router = useRouter()
const store = useErrorStore()
const errMessage = computed(
  () =>
    store.errorMessage ||
    'The link you entered does not look like a valid Kanban link'
)

onUnmounted(() => store.clearError())
</script>

<style scoped lang="scss"></style>
