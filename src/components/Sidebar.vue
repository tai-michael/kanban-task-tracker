<template>
  <nav
    class="flex flex-col shrink-0 bg-[var(--sidebar-bg)] absolute top-0 bottom-0 left-0 xs:w-[var(--sidebar-width)] xs:border-r xs:border-r-[var(--border)] transition-transform duration-300 ease-in-out"
    :class="isSidebarShown ? 'translate-x-0' : '-translate-x-full'"
  >
    <div
      class="hidden xs:flex items-center shrink-0 h-[var(--header-height-desktop)] pl-8"
    >
      <img
        :src="isDark ? LogoLight : LogoDark"
        class="cursor-pointer w-[150px]"
        @click="router.push('/')"
      />
    </div>

    <div
      v-if="boardStore.boards?.length > 0"
      class="hidden xs:flex xs:justify-center mb-4"
    >
      <BoardSearch />
    </div>

    <div class="overflow-auto relative">
      <BoardSelector @board-link-clicked="emit('boardLinkClicked')" />
    </div>

    <CreateBoardButton />

    <div class="relative flex flex-col mt-auto xs:pt-3 xs:mr-6">
      <DarkmodeToggle class="h-12 my-4 xs:my-0 xs:ml-6" />
      <HideSidebarButton @hide-sidebar-triggered="toggleSidebar" />
      <UserProfileButton />
    </div>
  </nav>

  <TransitionFade>
    <button
      v-if="!isSidebarShown"
      @click="toggleSidebar"
      type="button"
      class="show-sidebar-btn"
    >
      <img :src="ShowSidebar" />
    </button>
  </TransitionFade>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import BoardSelector from '@/components/BoardSelector.vue'
import BoardSearch from '@/components/BoardSearch.vue'
import DarkmodeToggle from '@/components/DarkmodeToggle.vue'
import HideSidebarButton from '@/components/HideSidebarButton.vue'
import UserProfileButton from '@/components/UserProfileButton.vue'
import LogoDark from '@/assets/images/logo-dark.svg'
import LogoLight from '@/assets/images/logo-light.svg'
import ShowSidebar from '@/assets/icons/icon-show-sidebar.svg'
import { useDark } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores'
const CreateBoardButton = defineAsyncComponent(
  () => import('@/components/CreateBoardButton.vue')
)
const TransitionFade = defineAsyncComponent(
  () => import('@/components/transitions/TransitionFade.vue')
)
const router = useRouter()
const boardStore = useBoardStore()
const emit = defineEmits(['boardLinkClicked'])
const isDark = useDark()

const isSidebarShown = useLocalStorage('is-sidebar-expanded', true)
const toggleSidebar = () => {
  isSidebarShown.value = !isSidebarShown.value
}
</script>

<style scoped lang="scss">
.show-sidebar-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 3.5rem;
  width: 40px;
  height: 48px;
  border-radius: 0px 100px 100px 0px;
  background-color: var(--main-purple);
}

.show-sidebar-btn:hover {
  background-color: var(--main-purple-hover);
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-color);
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background-color: var(--scrollbar-track-color);
  border-radius: 10px;
}

@media (min-width: 481px) {
  ::-webkit-scrollbar {
    width: 8px;
  }
}
</style>
