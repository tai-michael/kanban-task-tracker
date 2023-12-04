import { useBoardStore } from '@/stores'
import { v4 as uuidv4 } from 'uuid'
import updateFirestoreDoc from '@/composables/updateFirestoreDoc'

export default function (title: string) {
  const store = useBoardStore()

  const boardId = uuidv4()
  const boardMeta = {
    id: boardId,
    title: title,
  }
  const boardDetails = {
    id: boardId,
    title: title,
    lists: [],
  }

  // TODO consider security/access of boards and cards. Perhaps add verified_users field or something to these. Ask chatGPT.
  store.addBoard(boardMeta)
  updateFirestoreDoc('boards_single', boardId, boardDetails, false)
}
