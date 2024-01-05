<template>
  <div class="flex justify-center items-center mt-5">
    <div v-if="fetchingBoardsFromBackend">(Spinner placeholder)</div>
    <div v-else>
      {{ greetingMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  fetchingBoardsFromBackend: Boolean,
  greetingMessage: String,
})
</script>
