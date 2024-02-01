// import { useRouter } from 'vue-router'
import { auth, user } from '@/firebaseInit'
import {
  // createUserWithEmailAndPassword,
  // signInWithEmailAndPassword,
  // GoogleAuthProvider,
  // getAdditionalUserInfo,
  // signInWithPopup,
  signOut,
} from 'firebase/auth'
import { defineStore } from 'pinia'
// import { useCustomListsStore, usePremadeListsStore } from '@/stores'

export const useAuthStore = defineStore('auth', () => {
  // const premadeListsStore = usePremadeListsStore()
  // const customListsStore = useCustomListsStore()
  // const router = useRouter()

  const signOutUser = () => {
    // premadeListsStore.setActiveId(null)
    // customListsStore.setActiveId(null)
    // localStorage.setItem('selectedWord', '')
    signOut(auth)
  }

  return {
    signOutUser,
  }
})
