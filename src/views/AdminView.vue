<template>
  <main>Admin View</main>
  <div class="flex flex-col">
    <button @click="uploadInitialMockDataToFirestore">Add mock data</button>
    <button @click="uploadAllMockCardsToFirestore(mockCards)">
      Add mock cards
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { db, user, auth } from '@/firebaseInit'
import { setDoc, doc, getDoc, collection, writeBatch } from 'firebase/firestore'
import mockBoards from '@/mock_data/boards.json'
import mockBoard1 from '@/mock_data/board1.json'
import mockCards from '@/mock_data/cards.json'

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

const uploadInitialMockDataToFirestore = async () => {
  if (!auth.currentUser) return

  const boardsRef = doc(db, 'boards_grouped', mockBoards.userId)
  await setDoc(boardsRef, mockBoards)

  const board1Ref = doc(db, 'boards_single', mockBoard1.id)
  await setDoc(board1Ref, mockBoard1)

  console.log('mock data added')
}

const uploadAllMockCardsToFirestore = (cards) => {
  let batch = writeBatch(db)

  cards.forEach((card, index) => {
    const cardRef = doc(collection(db, 'cards'), card.id)
    batch.set(cardRef, card)

    // If 500 operations are reached or if it's the last item, commit the batch
    if (index % 500 === 499 || index === cards.length - 1) {
      batch.commit()
      batch = writeBatch(db) // Reset batch for the next set of operations
    }
  })
}

const uploadMockCardToFirestore = async (card: Object) => {
  const cardRef = doc(db, 'cards', card.id)
  await setDoc(cardRef, card)
}
</script>
