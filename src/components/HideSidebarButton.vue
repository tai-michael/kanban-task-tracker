<template>
  <div>
    <button
      @click="emit('hideSidebarTriggered')"
      type="button"
      class="w-full mt-2 p-3 pl-8 inline-flex items-center gap-4 hover-effect"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
    >
      <HideSidebarIcon
        :color="`${hovered ? 'var(--main-purple)' : 'var(--medium-gray)'}`"
      />
      <span class="text-[var(--medium-gray)] font-bold">Hide Sidebar</span>
    </button>
    <div class="mt-3 ml-6">
      <button @click="signOut(auth)" type="button" class="mr-4">
        Sign Out
      </button>
      <router-link :to="`/admin`">Admin</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HideSidebarIcon from '@/assets/icons/icon-hide-sidebar.vue'
import { auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
const emit = defineEmits(['hideSidebarTriggered'])
const hovered = ref(false)
</script>

<style scoped lang="scss">
.hover-effect:hover {
  background-color: var(--light-purple);
  border-radius: 0px 100px 100px 0px;

  span {
    color: var(--main-purple);
  }
}
</style>
