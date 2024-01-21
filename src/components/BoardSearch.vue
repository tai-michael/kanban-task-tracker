<template>
  <div v-if="store.isSearching" class="flex w-full ml-3">
    <input
      ref="searchBar"
      v-model="store.searchInput"
      @blur="handleBlur"
      placeholder="Search boards"
      class="w-full px-2 border-2 xs:h-10 xs:mr-3 xs:relative"
    />
  </div>
  <input
    v-else
    @click="beginSearch"
    placeholder="Search boards"
    class="hidden xs:flex xs:h-10 xs:mr-3 xs:relative w-full ml-3 px-2 border-2"
  />

  <div class="flex shrink-0 w-10 h-10 xs:w-11 xs:absolute xs:right-3">
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
import { ref, nextTick, watch, inject } from 'vue'
import SearchIcon from '@/assets/icons/icon-search.vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'
import { useSearchStore } from '@/stores'
import debounce from 'lodash/debounce'
const store = useSearchStore()
const isMobileView = inject('isMobileView')
const searchBar = ref()
const searchInput = ref('')

const beginSearch = () => {
  store.setSearchStatus(true)
  if (store.isSearching) nextTick(() => searchBar.value.focus())
}
const update = debounce(() => {
  store.setSearchInput(searchInput.value)
}, 500)
watch(searchInput, () => {
  update()
})

const stopSearch = () => {
  store.setSearchStatus(false)
  store.setSearchInput('')
  searchInput.value = '' // TODO test if i need this
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
