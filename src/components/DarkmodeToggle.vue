<template>
  <div
    class="flex justify-center items-center bg-[var(--light-gray)] rounded-md"
  >
    <img :src="SunIcon" class="mr-6" />
    <label
      class="relative w-10 h-5 bg-[var(--main-purple)] rounded-full cursor-pointer"
      for="dark-toggle"
    >
      <input
        type="checkbox"
        name="dark-mode"
        id="dark-toggle"
        class="hidden"
        v-model="isDark"
      />
      <div class="dot"></div>
    </label>

    <img :src="MoonIcon" class="ml-6" />
  </div>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'
import MoonIcon from '@/assets/icons/icon-dark-theme.svg'
import SunIcon from '@/assets/icons/icon-light-theme.svg'

const isDark = useDark()
</script>

<style scoped lang="scss">
.dot {
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 9999px;
  position: absolute;
  top: 0.125rem;
  left: 3px;
  transition: transform 0.15s ease !important;
}

input:checked + .dot {
  transform: translateX(1.15rem);
}
</style>
