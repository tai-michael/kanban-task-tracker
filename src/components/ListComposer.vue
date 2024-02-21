<template>
  <div class="min-w-[304px] ml-2 mr-2 pl-2 pr-2">
    <div v-if="isCreatingList" ref="composer" class="list-composer">
      <div class="input-form">
        <input
          v-model.trim="newListTitle"
          v-focus="isCreatingList"
          @keyup.enter="processListCreation"
          @keyup.esc="hideListComposer"
          placeholder="Enter a list title"
          class="w-full"
          ref="inputRef"
        />
      </div>
      <div class="flex gap-x-1.5">
        <button
          @click="processListCreation"
          type="submit"
          class="px-4 rounded text-white bg-[var(--main-purple)] hover:bg-[var(--main-purple-hover)] active:bg-[var(--main-purple-hover)]"
        >
          Add list
        </button>
        <button
          @click="hideListComposer"
          type="button"
          class="p-2.5 rounded hover:bg-[var(--icon-button-hover)] active:bg-[var(--icon-button-active)]"
        >
          <img :src="CrossIcon" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <button
      v-else
      @click.stop="showListComposer"
      type="button"
      class="flex items-center justify-center gap-x-2 w-full py-2 rounded bg-[var(--main-purple)] hover:bg-[var(--main-purple-hover)] active:bg-[var(--main-purple-hover)] text-white"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
    >
      <PlusIcon :color="'white'" /><span class="font-medium"
        >Add a new list</span
      >
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, inject, ref, type Ref } from 'vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'
import PlusIcon from '@/assets/icons/icon-add.vue'
import createAndAddList from '@/composables/createAndAddList'
const isCreatingList = ref(false)
const newListTitle = ref('')
const isMobileView = inject('isMobileView')
const hovered = ref(false)
const inputRef = ref()
const processListCreation = async () => {
  if (!newListTitle.value) return
  createAndAddList(newListTitle.value)
  newListTitle.value = ''

  if (isMobileView.value) hideListComposer()
  else inputRef.value.focus()

  await nextTick()
  if (isMobileView.value) {
    const listsContainer = document.querySelector('.lists-container')
    const newestList =
      listsContainer.children[listsContainer.children.length - 1]
    newestList.scrollIntoView({ behavior: 'smooth' })
  } else {
    // In desktop view, the screen is wide enough such that the new list will always be in view
    const boardContainer = document.querySelector('.board-container')
    boardContainer.scrollLeft = boardContainer.scrollWidth
  }
}

const showListComposer = async () => {
  isCreatingList.value = true
  hovered.value = false

  await nextTick()
  const boardContainer = document.querySelector('.board-container')
  boardContainer.scrollTo({
    left: boardContainer.scrollWidth,
    behavior: 'smooth',
  })
}

const composer: Ref<HTMLElement | null> = ref(null)
const hideListComposer = () => {
  isCreatingList.value = false
}
const handleClickOutside = (e: MouseEvent) => {
  if (composer.value && !composer.value.contains(e.target as Node))
    hideListComposer()
}
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.input-form {
  display: flex;
  background: rgb(212, 212, 212);
  border-radius: 8px;
  min-height: 24px;

  input {
    padding: 8px;
  }
}

.list-composer {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding: 8px;
  border-radius: 4px;
  background-color: hsl(220 69% 98.5%);
  box-shadow: var(--box-shadow-light);
}

.background-light-gray {
  background: linear-gradient(
    180deg,
    #e9effa 0%,
    rgba(233, 239, 250, 0.5) 100%
  );
  // background-color: #ffffff3d; // opaque background alternative
}
</style>
