<template>
  <!-- <transition name="fade" @enter="onEnter" @leave="onLeave"> -->
  <!-- <transition name="fade" @enter="onEnter" mode="out-in"> -->
  <transition name="fade-slide" mode="out-in">
    <slot></slot>
  </transition>
</template>

<script setup lang="ts">
// const onEnter = (el, done) => {
//   const delay = 2000 // Delay in milliseconds
//   setTimeout(() => {
//     el.style.opacity = 1
//     done()
//   }, delay)
// }

// onLeave()
</script>

<style>
.fade-slide-enter-from,
.fade-slide-leave-to {
  /* opacity: 0; */
  transform: translateX(-100%);
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  /* transition: opacity 0.2s, transform 0.2s; */
  transition: transform 0.2s;
}
</style>
