<template>
  <nav class="flex flex-col">
    <img
      :src="LogoDark"
      class="logo cursor-pointer w-[150px] ml-8 mt-8 mb-14"
      @click="router.push('/')"
    />

    <BoardSelector />

    <div v-if="store.isCreatingNewBoard" class="board-composer">
      <BoardComposer />
    </div>

    <div class="mt-auto flex flex-col">
      <DarkmodeToggle class="darkmode-toggle h-12 ml-6 mr-6" />
      <HideSidebarButton class="hide-sidebar-btn" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import LogoDark from '@/assets/images/logo-dark.svg'
import BoardSelector from '@/components/BoardSelector.vue'
import DarkmodeToggle from '@/components/DarkmodeToggle.vue'
import HideSidebarButton from '@/components/HideSidebarButton.vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
const BoardComposer = defineAsyncComponent(
  () => import('@/components/BoardComposer.vue')
)
const router = useRouter()
const store = useBoardStore()
</script>

<style scoped lang="scss">
nav {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 264px;
  height: 322px;
  background-color: white;
  border-radius: 8px;

  // padding: 5rem 6rem;
  box-shadow: 0px 10px 20px 0px rgba(54, 78, 126, 0.25);
  z-index: 2;
}

@media (max-width: 480px) {
  nav {
    transition: opacity 0.5s, visibility 0.5s;
  }
}

.logo,
.hide-sidebar-btn {
  display: none;
}

.darkmode-toggle {
  margin: 1rem;
}

.board-composer {
  z-index: 1;
  position: absolute;
  top: 0; // Align top with Sidebar
  left: 100%; // Position to the right of Sidebar
  width: 300px;
  height: 180px;
  background-color: white; // Optional, for visibility
  border: 1px solid #ccc; // Optional, for visibility
  border-radius: 8px;
}

@media (min-width: 481px) {
  nav {
    position: relative;
    top: unset;
    left: unset;
    transform: none;
    width: 300px;
    height: 100%;
    flex-shrink: 0;
    border-right: 1px solid var(--lines-light);
    border-radius: 0;
    box-shadow: none;
  }

  .logo,
  .hide-sidebar-btn {
    display: block;
    margin-right: 1.5rem;
  }

  .darkmode-toggle {
    margin: 0 1.5rem;
  }
}
</style>
