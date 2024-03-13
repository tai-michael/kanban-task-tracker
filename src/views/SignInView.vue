<template>
  <div
    class="flex h-full flex-col justify-center items-center gap-y-6 bg-[var(--very-light-gray)] dark:bg-[var(--dark-gray)]"
  >
    <img :src="isDark ? LogoLight : LogoDark" class="w-[150px]" />
    <FirebaseUI />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import LogoDark from '@/assets/images/logo-dark.svg'
import LogoLight from '@/assets/images/logo-light.svg'
import { useDark } from '@vueuse/core'
const FirebaseUI = defineAsyncComponent(
  () => import('@/components/FirebaseUI.vue')
)
const isDark = useDark()
</script>
