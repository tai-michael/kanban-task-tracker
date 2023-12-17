import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase/useAuth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

const { isAuthenticated, user } = useAuth(auth)
export { isAuthenticated, user }
