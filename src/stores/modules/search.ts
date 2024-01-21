import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const isSearching = ref(false)
  const setSearchStatus = (status: boolean) => {
    isSearching.value = status
  }

  const searchInput = ref('')
  const setSearchInput = (input: string) => {
    searchInput.value = input
  }

  return {
    isSearching,
    setSearchStatus,

    searchInput,
    setSearchInput,
  }
})
