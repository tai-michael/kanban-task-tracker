import { useBoardStore } from '@/stores'
import { useCardStore } from '@/stores'
import { v4 as uuidv4 } from 'uuid'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import { auth } from '@/firebaseInit'

export default async function (listId: string, title: string) {
  const boardStore = useBoardStore()
  const cardStore = useCardStore()

  const cardId = uuidv4()
  const cardSummary = {
    title: title,
    id: cardId,
    due_date: '',
    checklist_progress: '',
  }
  const cardDetails = {
    id: cardId,
    boardId: boardStore.board.id,
    description: '',
    checklist: [],
    attachments: '(attachments)',
    created_by: auth.currentUser.uid,
  }

  await updateFirestoreDoc('cards', cardId, cardDetails, false)
  boardStore.addCard(listId, cardSummary)
  cardStore.memoizeCard(cardDetails)
}
