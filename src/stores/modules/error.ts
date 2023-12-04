import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const showErrorPage = ref(false)
  const errorMessage = ref('')

  const setError = (showError: boolean, message: string) => {
    showErrorPage.value = showError
    errorMessage.value = message
  }

  const triggerError = (message: string) => {
    setError(true, message)
  }

  const clearError = () => {
    setError(false, '')
  }

  return {
    showErrorPage,
    errorMessage,

    triggerError,
    clearError,
  }
})
