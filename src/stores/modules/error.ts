import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useErrorStore = defineStore('error', () => {
  const router = useRouter()
  const errorMessage = ref('')

  const setErrorMessage = (message: string) => {
    errorMessage.value = message
  }

  const triggerError = (message: string) => {
    setErrorMessage(message)
    router.replace({
      name: 'page-not-found',
      params: {
        pathMatch: router.currentRoute.value.path.split('/').slice(1),
      },
      query: router.currentRoute.value.query,
      hash: router.currentRoute.value.hash,
    })
  }

  const clearError = () => {
    setErrorMessage('')
  }

  return {
    errorMessage,

    triggerError,
    clearError,
  }
})
