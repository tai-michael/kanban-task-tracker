<template>
  <span
    class="spinner"
    :class="{ [props.spinnerClasses]: props.spinnerClasses }"
  ></span>
</template>

<script setup lang="ts">
const props = defineProps({
  // NOTE must define width, height, border width, and border color
  spinnerClasses: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="scss">
.spinner {
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
