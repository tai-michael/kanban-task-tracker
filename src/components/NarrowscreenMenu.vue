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
        class="absolute right-5 top-5 py-1 px-4 bg-slate-400"
      >
        X
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
  z-index: 10;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(177, 177, 177);
  opacity: 0.25;
  height: 100vh;
  width: 100vh;
  z-index: 9;
}
</style>
