<template>
  <div class="flex w-10 h-10">
    <button @click="toggleMenu" type="button" class="icon-button">
      <MenuIcon class="w-7 h-7" />
    </button>
  </div>

  <div v-if="isOpen" @click="toggleMenu" class="backdrop"></div>

  <TransitionFadeAndSlide>
    <div v-if="isOpen" class="menu">
      <button
        @click="toggleMenu"
        type="button"
        aria-label="Close menu"
        class="absolute top-2.5 right-2.5 z-10 p-2 rounded-full hover:bg-[var(--icon-button-hover)] active:bg-[var(--icon-button-active)] transition-colors duration-100"
      >
        <CrossIcon />
      </button>

      <ul class="flex flex-col gap-y-6 mt-5">
        <li>(User profile button)</li>
        <li><DarkmodeToggle class="h-12" /></li>
      </ul>
    </div>
  </TransitionFadeAndSlide>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DarkmodeToggle from '@/components/DarkmodeToggle.vue'
import TransitionFadeAndSlide from '@/components/transitions/TransitionFadeAndSlide.vue'
import MenuIcon from '@/assets/icons/icon-menu.vue'
import CrossIcon from '@/assets/icons/icon-cross.vue'
const isOpen = ref(false)
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped lang="scss">
.menu {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  padding: 3rem;
  width: 45vh;
  height: 100vh;
  z-index: var(--z-popover);
}

.dark .menu {
  background-color: hsla(235, 12%, 21%, 1);
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  height: 100vh;
  width: 100%;
  z-index: var(--z-backdrop);
}
</style>
