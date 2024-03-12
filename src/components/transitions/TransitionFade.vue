<template>
  <transition name="fade" mode="out-in">
    <slot></slot>
  </transition>
</template>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
  /* z-index needed for smooth transition when popover appears over a modal */
  z-index: var(--z-popover);
}
</style>
