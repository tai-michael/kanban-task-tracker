<template>
  <nav
    class="flex flex-col shrink-0 xs:w-[var(--sidebar-width)] xs:border-r xs:border-r-[var(--lines-light)]"
  >
    <div
      class="hidden xs:flex items-center shrink-0 h-[var(--header-height-desktop)] pl-8"
    >
      <img
        :src="LogoDark"
        class="cursor-pointer w-[150px]"
        @click="router.push('/')"
      />
    </div>

    <div class="overflow-auto relative pt-3.5">
      <!-- <button
        type="button"
        @click="emit('closeClicked')"
        class="absolute top-0 right-4 xs:hidden"
      >
        <img :src="CrossIcon" />
      </button> -->
      <BoardSelector
        @board-link-clicked="emit('boardLinkClicked')"
        @board-composer-triggered="emit('boardComposerTriggered')"
      />
    </div>
    <div class="flex flex-col mt-auto xs:pt-3">
      <DarkmodeToggle class="m-4 xs:my-0 xs:mx-6 h-12 ml-6 mr-6" />
      <HideSidebarButton class="hidden xs:block xs:mr-6" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import LogoDark from '@/assets/images/logo-dark.svg'
import BoardSelector from '@/components/BoardSelector.vue'
import DarkmodeToggle from '@/components/DarkmodeToggle.vue'
import HideSidebarButton from '@/components/HideSidebarButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const emit = defineEmits([
  'boardLinkClicked',
  'boardComposerTriggered',
  'closeClicked',
])
</script>

<style scoped lang="scss"></style>
