<template>
  <div class="h-full flex flex-col items-center text-center pt-40 p-2 gap-y-6">
    <h1 class="font-bold text-2xl">Page not found</h1>
    <span class="text-lg mx-5">{{ errMessage }}</span>
    <button
      @click="router.push('/')"
      type="button"
      class="p-1.5 bg-blue-300 rounded"
    >
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
