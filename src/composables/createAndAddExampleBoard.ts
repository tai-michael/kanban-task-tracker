import exampleBoards from '@/mock_data/boards.json'
import exampleBoard1 from '@/mock_data/board1.json'
import exampleCards from '@/mock_data/cards.json'
import type { BoardDetails, BoardsMeta, CardDescription } from '@/types'
import { db, auth, user } from '@/firebaseInit'
import { setDoc, doc, collection, writeBatch } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

export default async function () {
  const boardId = uuidv4()

  try {
    const cardIdMap = await uploadExampleCardsToFirestore(boardId, exampleCards)
    const boardsMeta = await uploadExampleBoardToFirestore(
      exampleBoards,
      exampleBoard1,
      boardId,
      cardIdMap
    )

    return boardsMeta?.boards
  } catch (err) {
    console.error('Failed to upload example board:', err)
    return []
  }
}

const uploadExampleCardsToFirestore = (
  boardId: string,
  cards: CardDescription[]
): Promise<Map<string, string>> => {
  let batch = writeBatch(db)

  let cardIdMap = new Map<string, string>()

  cards.forEach((card, index) => {
    card.boardId = boardId
    card.created_by = auth.currentUser.uid
    card.checklist.forEach((item) => {
      item.id = uuidv4()
    })

    // Replaces card's old ID (a placeholder) with new UUID. This is necessary, as each card in the app must have a unique ID for routing and security purposes. And placeholder IDs are needed to link individual cards (card details) with card previews in board object.
    const placeholderId = card.id
    const newId = uuidv4()
    cardIdMap.set(placeholderId, newId)
    card.id = newId

    const cardRef = doc(collection(db, 'cards'), card.id)
    batch.set(cardRef, card)

    // If 500 operations are reached or if it's the last item, commit the batch
    if (index % 500 === 499 || index === exampleCards.length - 1) {
      batch.commit()
      batch = writeBatch(db) // Reset batch for the next set of operations
    }
  })

  console.log('example cards added')
  return cardIdMap
}

const uploadExampleBoardToFirestore = async (
  boardsMeta: BoardsMeta,
  board: BoardDetails,
  boardId: string,
  cardIdMap: Map<string, string>
) => {
  if (!auth.currentUser) return

  boardsMeta.userId = auth.currentUser.uid
  boardsMeta.boards[0].id = boardId

  const boardsRef = doc(db, 'boards_grouped', boardsMeta.userId)
  await setDoc(boardsRef, boardsMeta)

  board.created_by = boardsMeta.userId
  board.id = boardId

  board.lists.forEach((list, index) => {
    list.id = uuidv4()
    list.cards.forEach((card) => {
      const newId = cardIdMap.get(card.id) // Match & replace placeholder IDs
      if (newId) {
        card.id = newId
      } else {
        console.error(`No new ID found for card with old ID: ${card.id}`)
      }

      if (index < 2 && Math.random() > 0.4) {
        // For the first two lists, mark some cards with past due dates (i.e. overdue) and others with future due dates, while leaving the remaining cards with no due dates
        const isFuture = Math.random() > 0.3 // 70% chance of future date
        let offsetDays = isFuture
          ? Math.floor(Math.random() * 10) + 5
          : -(Math.floor(Math.random() * 14) + 1) // between 5-14 days
        const dueDate = new Date(Number(user.value?.metadata.createdAt))
        dueDate.setDate(dueDate.getDate() + offsetDays)
        card.due_date = dueDate
      } else if (index === 2 && Math.random() > 0.4) {
        // For the third list, mark some cards as completed 1-14 days ago
        card.is_completed = true
        const offsetDays = -(Math.floor(Math.random() * 14) + 1)
        const dueDate = new Date(Number(user.value?.metadata.createdAt))
        dueDate.setDate(dueDate.getDate() + offsetDays)
        card.due_date = dueDate
      }
    })
  })

  const board1Ref = doc(db, 'boards_single', board.id)
  await setDoc(board1Ref, board)

  console.log('example board added')
  return boardsMeta
}
