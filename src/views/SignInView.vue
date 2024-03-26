<template>
  <div
    class="h-full flex justify-center items-center dark:bg-[var(--dark-gray)] bg-[var(--main-purple-transparent)]"
  >
    <div
      class="flex flex-col items-center w-[290px] gap-y-6 border dark:border-[var(--main-purple)] rounded-lg pb-5 bg-white dark:bg-[var(--dark-gray)] px-1.5 bg-[var(--very-light-gray)] min-h-[235px]"
    >
      <img :src="isDark ? LogoLight : LogoDark" class="w-[150px] mt-9" />
      <FirebaseUI />
    </div>
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
