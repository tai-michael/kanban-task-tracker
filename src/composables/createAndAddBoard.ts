import { useBoardStore } from '@/stores'
import { v4 as uuidv4 } from 'uuid'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'
import { auth } from '@/firebaseInit'

export default async function (title: string) {
  const store = useBoardStore()

  const boardId = uuidv4()
  const boardMeta = {
    id: boardId,
    title: title,
  }
  const boardDetails = {
    created_by: auth.currentUser.uid,
    id: boardId,
    title: title,
    lists: [],
  }

  await updateFirestoreDoc('boards_single', boardId, boardDetails, false)
  store.addBoard(boardMeta)
}
