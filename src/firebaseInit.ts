import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { useAuth } from '@vueuse/firebase/useAuth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)

const app = firebase.initializeApp(firebaseConfig)
export const auth = firebase.auth(app)
// export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

const { isAuthenticated, user } = useAuth(auth)
export { isAuthenticated, user }
