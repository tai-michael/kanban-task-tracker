<template>
  <!-- <svg :fill="color" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z" />
  </svg> -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    :fill="color"
    class="bi bi-clock"
    viewBox="0 0 16 16"
  >
    <path
      d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
    />
    <path
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps(['color'])
</script>
