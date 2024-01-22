<template>
  <input
    v-if="store.isSearching"
    ref="searchBar"
    v-model="searchInput"
    @blur="handleBlur"
    placeholder="Search boards"
    class="flex w-full xs:w-[250px] ml-3 px-2 xs:mr-3 xs:h-10 xs:relative border-2"
  />
  <input
    v-else
    @click="beginSearch"
    placeholder="Search boards"
    class="hidden xs:flex w-full xs:w-[250px] ml-3 px-2 xs:mr-3 xs:h-10 xs:relative border-2"
  />

  <div class="flex shrink-0 w-10 h-10 xs:w-11 xs:absolute xs:right-6">
    <button
      v-if="!store.isSearching"
      @click="beginSearch"
      class="flex items-center justify-center w-full h-full"
    >
      <SearchIcon :fill="'black'" class="w-5 h-5" />
    </button>
    <button
      v-else
      @click="stopSearch"
      class="flex items-center justify-center w-full h-full"
    >
      <SearchIcon
        v-if="!store.isSearching"
        @click="beginSearch"
        :fill="'black'"
        class="w-5 h-5"
      />
      <img :src="CrossIcon" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, inject, computed, watch } from 'vue'
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
