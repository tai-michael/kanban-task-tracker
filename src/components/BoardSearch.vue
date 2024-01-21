<template>
  <div v-if="store.isSearching" class="flex w-full ml-3">
    <input
      ref="searchBar"
      v-model="store.searchInput"
      placeholder="Search"
      class="w-full border-2 px-2"
    />
  </div>

  <input
    v-if="!store.isSearching"
    @click="beginSearch"
    placeholder="Search boards"
    class="hidden xs:flex border-2 w-full ml-3 px-2"
  />

  <div class="flex shrink-0 w-10 h-10">
    <button v-if="!store.isSearching" @click="beginSearch" class="icon-button">
      <SearchIcon :fill="'black'" class="w-5 h-5" />
    </button>
    <button v-else @click="stopSearch" class="icon-button">
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

</script>

<style scoped lang="scss">
.icon-button {
  width: 100%;
  height: 100%;
  border-radius: 9999px; /* fully rounded */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
}

.icon-button:hover,
.icon-button:active {
  background-color: var(--header-button-hover);
}
</style>
