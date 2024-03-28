<template>
  <div class="relative flex w-full h-10 xs:w-[unset]">
    <input
      v-if="store.isSearching"
      ref="searchBar"
      v-model="searchInput"
      @blur="handleBlur"
      placeholder="Search boards"
      class="w-full xs:w-[250px] mx-3 pl-3 pr-11 border rounded xs:rounded-lg outline-none ring-2 ring-[var(--main-purple)]"
    />
    <input
      v-else
      @click="beginSearch"
      placeholder="Search boards"
      class="hidden xs:block w-full xs:w-[250px] mx-3 pl-3 bg-[var(--search-input-bg)] border border-[var(--search-input-border-color)] rounded xs:rounded-lg outline-none focus:ring-1 focus:ring-[var(--main-purple)]"
    />

    <div class="flex shrink-0 absolute top-0 right-3 w-12 h-10">
      <button
        v-if="store.isSearching"
        @click="stopSearch"
        type="button"
        class="flex items-center justify-center w-full h-full"
      >
        <CrossIcon class="w-4 h-4" />
      </button>
      <button
        v-else
        @click="beginSearch"
        type="button"
        class="flex items-center justify-center w-full h-full"
      >
        <SearchIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, inject, computed } from 'vue'
import SearchIcon from '@/assets/icons/icon-search.vue'
import CrossIcon from '@/assets/icons/icon-cross.vue'
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
  store.setSearchInput(input.toLowerCase())
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
