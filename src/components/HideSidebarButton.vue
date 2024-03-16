<template>
  <button
    @click="emit('hideSidebarTriggered')"
    type="button"
    class="hidden xs:inline-flex items-center gap-4 w-full mt-3 p-3 pl-8 hover:sidebar-navbtn-hover-effect"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <HideSidebarIcon
      :color="hovered ? 'var(--main-purple)' : 'var(--medium-dark-gray)'"
    />
    <span class="text-[var(--medium-dark-gray)] font-bold">Hide Sidebar</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HideSidebarIcon from '@/assets/icons/icon-hide-sidebar.vue'
const emit = defineEmits(['hideSidebarTriggered'])
const hovered = ref(false)
</script>
