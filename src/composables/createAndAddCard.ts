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
    id: cardId,
    title: title,
    due_date: '',
    is_completed: false,
    checklist_items_completed: 0,
    checklist_items_total: 0,
    attachments_total: 0,
  }
  const cardDetails = {
    id: cardId,
    boardId: boardStore.board.id,
    created_by: auth.currentUser.uid,
    description: '',
    checklist: [],
    attachments: [],
  }

  await updateFirestoreDoc('cards', cardId, cardDetails, false)
  boardStore.addCard(listId, cardSummary)
  cardStore.memoizeCard(cardDetails)
}
