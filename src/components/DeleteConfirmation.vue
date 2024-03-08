<template>
  <h2 class="text-lg font-bold select-none text-[#EA5555]">
    <slot name="header"></slot>
  </h2>

  <span class="font-medium text-sm text-[var(--medium-dark-gray)] leading-6">
    <slot name="body"></slot>
  </span>

  <div class="flex gap-x-4 gap-y-4 flex-wrap-reverse xs:flex-nowrap">
    <button
      @click="emit('cancelTriggered')"
      type="button"
      class="modal-button text-[13px] text-[var(--main-purple)] font-bold bg-[var(--main-purple-transparent)] dark:hover:bg-[white] hover:bg-[var(--icon-button-hover)] active:bg-[var(--icon-button-active)] transition-colors duration-100 ease-in-out"
    >
      <slot name="cancel-button">Cancel</slot>
    </button>
    <button
      @click="emit('deleteTriggered')"
      type="button"
      class="modal-button text-[13px] text-white font-bold bg-red-500 hover:bg-red-400 active:bg-red-300 transition-colors duration-100 ease-in-out"
    >
      <slot name="delete-button">Delete</slot>
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['cancelTriggered', 'deleteTriggered'])
</script>

<style scoped lang="scss"></style>
