<template>
  <div class="flex w-10 h-10">
    <button @click="toggleMenu" type="button" class="icon-button">
      <MenuIcon :fill="'black'" class="w-7 h-7" />
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
        <img :src="CrossIcon" />
      </button>
      <ul>
        <li>Darkmode toggle</li>
        <li>(User profile button)</li>
      </ul>
    </div>
  </TransitionFadeAndSlide>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TransitionFadeAndSlide from '@/components/transitions/TransitionFadeAndSlide.vue'
import MenuIcon from '@/assets/icons/icon-menu.vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'
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
  width: 50vh;
  height: 100vh;
  z-index: var(--z-popover);
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
