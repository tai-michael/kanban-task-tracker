<template>
  <nav class="flex flex-col">
    <img
      :src="LogoDark"
      class="logo cursor-pointer w-[150px] ml-8 mt-8 mb-14"
      @click="router.push('/')"
    />

    <!-- TODO extract below div into its own component, so that it can be used for mobile version, which does not have the logo and hide sidebar portion (just board selection and darkmode toggle)-->
    <div class="board-selection flex w-full pr-6">
      <div v-if="fetchingBoardsFromBackend">Loading...</div>
      <div v-else class="w-full">
        <label
          v-if="store.boards.length > 0"
          class="ml-8 text-xs font-bold uppercase tracking-[2.4px] text-[var(--medium-gray)]"
          >All boards ({{ store.boards.length }})</label
        >
        <ul class="board-list mt-5 flex flex-col">
          <li
            v-for="board in store.boards"
            :key="board.id"
            :title="board.title"
          >
            <!-- TODO add click handler for closing modal -->
            <router-link
              :to="`/board/${board.id}`"
              @mouseenter="onMouseEnterBoardLink(board.id)"
              @mouseleave="onMouseLeaveBoardLink"
              class="flex items-center w-full p-3 pl-8 gap-x-4"
              :class="[
                {
                  'active-board': board.id === route.params.boardId,
                  'hover-effect': board.id !== route.params.boardId,
                },
              ]"
            >
              <BoardIcon :color="getBoardIconColor(board.id)" />
              <span
                class="truncate whitespace-nowrap font-bold text-[var(--medium-gray)]"
                >{{ board.title }}</span
              ></router-link
            >
          </li>
          <button
            @click.stop="store.toggleBoardComposer"
            class="flex items-center w-full p-3 pl-8 gap-x-4 hover-effect"
          >
            <BoardIcon :color="'var(--main-purple)'" />
            <span class="font-bold text-[var(--main-purple)]"
              >+ Create new board</span
            >
          </button>
        </ul>
      </div>
    </div>

    <div v-if="store.isCreatingNewBoard" class="board-composer">
      <BoardComposer />
    </div>

    <div class="mt-auto flex flex-col">
      <DarkmodeToggle class="darkmode-toggle h-12 ml-6 mr-6" />
      <!-- TODO Extract below into HideSidebarButton component -->
      <div class="hide-sidebar-btn">
        <button
          class="w-full mt-2 p-3 pl-8 inline-flex items-center gap-4 hover-effect"
          @mouseover="hideSidebarButtonHovered = true"
          @mouseleave="hideSidebarButtonHovered = false"
        >
          <HideSidebarIcon
            :color="`${
              hideSidebarButtonHovered
                ? 'var(--main-purple)'
                : 'var(--medium-gray)'
            }`"
          />
          <span class="text-[var(--medium-gray)] font-bold">Hide Sidebar</span>
        </button>
        <div class="mt-3 ml-6">
          <button class="mr-4" @click="signOut(auth)">Sign Out</button>
          <router-link :to="`/admin`">Admin</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import LogoDark from '@/assets/images/logo-dark.svg'
import BoardIcon from '@/assets/icons/icon-board.vue'
import DarkmodeToggle from '@/components/DarkmodeToggle.vue'
import HideSidebarIcon from '@/assets/icons/icon-hide-sidebar.vue'
import { auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { useBoardStore } from '@/stores'
const BoardComposer = defineAsyncComponent(
  () => import('@/components/BoardComposer.vue')
)
defineProps(['fetchingBoardsFromBackend'])
const store = useBoardStore()

const hoveredBoardId = ref(null)
const onMouseEnterBoardLink = (boardId: string) => {
  hoveredBoardId.value = boardId
}
const onMouseLeaveBoardLink = () => {
  hoveredBoardId.value = null
}
const getBoardIconColor = (boardId: string) => {
  if (boardId === route.params.boardId) {
    return 'white' // Active board color
  } else if (boardId === hoveredBoardId.value) {
    return 'var(--main-purple)' // Hover color
  }
  return 'var(--medium-gray)' // Default color
}

const hideSidebarButtonHovered = ref(false)
</script>

<style scoped lang="scss">
.active-board {
  background-color: var(--main-purple);
  border-radius: 0px 100px 100px 0px;

  img {
    color: white;
  }
  span {
    color: white;
  }
}

.hover-effect:hover {
  background-color: var(--light-nav-hover);
  border-radius: 0px 100px 100px 0px;

  span {
    color: var(--main-purple);
  }
}

.board-composer {
  z-index: 1;
  position: absolute;
  top: 0; // Align top with Sidebar
  left: 100%; // Position to the right of Sidebar
  width: 300px;
  height: 180px;
  background-color: white; // Optional, for visibility
  border: 1px solid #ccc; // Optional, for visibility
  border-radius: 8px;
}

.logo,
.hide-sidebar-btn {
  display: none;
}

.board-selection {
  margin-top: 1rem;
}

.board-list {
  max-height: 12em;
  overflow: scroll;
}

.darkmode-toggle {
  margin: 1rem;
}

nav {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 264px;
  height: 322px;
  background-color: white;
  border-radius: 8px;

  // padding: 5rem 6rem;
  box-shadow: 0px 10px 20px 0px rgba(54, 78, 126, 0.25);
  z-index: 9999;
}

@media (max-width: 480px) {
  nav {
    transition: opacity 0.5s, visibility 0.5s;
  }
}

@media (min-width: 481px) {
  nav {
    position: relative;
    top: unset;
    left: unset;
    transform: none;
    width: 300px;
    height: 100%;
    flex-shrink: 0;
    border-right: 1px solid var(--lines-light);
    border-radius: 0;
    box-shadow: none;
  }

  .logo,
  .hide-sidebar-btn {
    display: block;
    margin-right: 1.5rem;
  }

  .board-selection {
    margin-top: 0;
  }

  .board-list {
    max-height: unset;
    overflow: unset;
  }

  .darkmode-toggle {
    margin: 0 1.5rem;
  }
}
</style>
