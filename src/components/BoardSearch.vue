<template>
  <div class="relative flex w-full h-10 xs:w-[unset]">
    <input
      v-if="store.isSearching"
      ref="searchBar"
      v-model="searchInput"
      @blur="handleBlur"
      placeholder="Search boards"
      class="w-full xs:w-[250px] mx-3 px-2 border-2"
    />
    <input
      v-else
      @click="beginSearch"
      placeholder="Search boards"
      class="hidden xs:block w-full xs:w-[250px] mx-3 px-2 border-2"
    />

    <div class="flex shrink-0 absolute top-0 right-3 w-12 h-10">
      <button
        v-if="!store.isSearching"
        @click="beginSearch"
        type="button"
        class="flex items-center justify-center w-full h-full"
      >
        <SearchIcon :fill="'black'" class="w-5 h-5" />
      </button>
      <button
        v-else
        @click="stopSearch"
        type="button"
        class="flex items-center justify-center w-full h-full"
      >
        <img :src="CrossIcon" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, inject, computed } from 'vue'
import SearchIcon from '@/assets/icons/icon-search.vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'
import { useSearchStore } from '@/stores'
import debounce from 'lodash/debounce'
const store = useSearchStore()
const isMobileView = inject('isMobileView')
const searchBar = ref()
const searchInput = computed({
  get() {
    return store.searchInput
  },
  set(input) {
    setDebouncedSearchInput(input)
  },
})
const setDebouncedSearchInput = debounce((input: string) => {
  store.setSearchInput(input)
}, 200)

const beginSearch = () => {
  store.setSearchStatus(true)
  if (store.isSearching) nextTick(() => searchBar.value.focus())
}

const stopSearch = () => {
  store.setSearchStatus(false)
  searchInput.value = ''
}

const handleBlur = () => {
  if (isMobileView.value) {
    // Delay stop search to allow navigating to board link
    setTimeout(stopSearch, 10)
  } else {
    if (!store.searchInput) {
      stopSearch()
    }
  }
}
</script>

<style scoped lang="scss"></style>
