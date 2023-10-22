<template>
  <main>DASHBOARD VIEW!</main>
  <div class="flex flex-col">
    <button @click="signOut(auth)">Sign Out</button>
    <button @click="uploadInitialMockDataToFirestore">Add mock data</button>
    <button @click="uploadAllMockCardsToFirestore(mockCards)">
      Add mock cards
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db, user, auth } from '@/firebaseInit'
import { signOut } from 'firebase/auth'
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

  // const boardsRef = doc(db, 'boards_grouped', mockBoards.userId)
  // await setDoc(boardsRef, mockBoards)

  const board1Ref = doc(db, 'boards_single', mockBoard1.id)
  await setDoc(board1Ref, mockBoard1)

  console.log('mock data added')
}

const uploadMockCardToFirestore = async (card: Object) => {
  const cardRef = doc(db, 'cards', card.id)
  await setDoc(cardRef, card)
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

const boards = ref({})
const board1 = ref({})
const card1 = ref({})

const fetchBoardsData = async (id: string) => {
  const boardsRef = doc(db, 'boards_grouped', id)
  const boardsDoc = await getDoc(boardsRef)
  if (boardsDoc.exists()) return boardsDoc.data()
}

const fetchBoard1Data = async (id: string) => {
  const board1Ref = doc(db, 'boards_single', id)
  const board1Doc = await getDoc(board1Ref)
  if (board1Doc.exists()) return board1Doc.data()
}

const fetchCard1Data = async (id: string) => {
  const card1Ref = doc(db, 'cards', id)
  const card1Doc = await getDoc(card1Ref)
  if (card1Doc.exists()) return card1Doc.data()
}

onMounted(async () => {
  // console.log(mockCards)

  fetchingBackendData.value = true
  await fetchBackendData()
  fetchingBackendData.value = false
  console.log('Fetched backend data')
  boards.value = await fetchBoardsData(auth.currentUser.uid)
  console.log(boards.value)
  board1.value = await fetchBoard1Data(boards.value.boards[0].id)
  console.log(board1.value)
  card1.value = await fetchCard1Data(board1.value.lists[0].cards[0].id)
  console.log(card1.value)
})
</script>
