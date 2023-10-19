<template>
  <main>DASHBOARD VIEW!</main>
  <button @click="signOut(auth)">Sign Out</button>
  <button @click="addMock">Add mock data</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db, user, auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
import { setDoc, doc, getDoc, collection } from 'firebase/firestore'
import mockData from '../../mock-data.json'

const fetchingBackendData = ref(false)
const fetchBackendData = async () => {
  if (!user.value) throw new Error('User not defined')

  const usersDocRef = doc(db, 'users', user.value.uid)
  let userDocSnap = await getDoc(usersDocRef)
  const userLists = ref(userDocSnap.data()?.lists)
  console.log('Fetched user data from firestore')
  console.log(userDocSnap.data())
  console.log(userLists)
}

const addMock = async () => {
  if (!auth.currentUser) return

  const boardRef = doc(db, 'boards', auth.currentUser.uid)
  await setDoc(boardRef, mockData)
  console.log('mock data added')
  // console.log('New board created with ID:', boardRef.id)
}

const board = ref({})
const fetchBoardData = async (id: string) => {
  const boardRef = doc(db, 'boards', id)
  const boardDoc = await getDoc(boardRef)
  if (boardDoc.exists()) return boardDoc.data()
}

onMounted(async () => {
  fetchingBackendData.value = true
  await fetchBackendData()
  fetchingBackendData.value = false
  console.log('Fetched backend data')
  board.value = await fetchBoardData(auth.currentUser.uid)
  console.log(board.value)
})
</script>
