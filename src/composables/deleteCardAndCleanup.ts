import { useBoardStore } from '@/stores'
import { db, auth, storage } from '@/firebaseInit'
import { doc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, listAll, deleteObject } from 'firebase/storage'

export default function (boardId: string, cardId: string) {
  const store = useBoardStore()

  store.deleteCardFromStore(cardId)
  deleteDoc(doc(db, 'cards', cardId))
  deleteCardAttachmentsFromFirebaseStorage(boardId, cardId)
}

const deleteCardAttachmentsFromFirebaseStorage = async (
  boardId: string,
  cardId: string
) => {
  const cardFolderRef = storageRef(
    storage,
    `attachments/${auth.currentUser.uid}/${boardId}/${cardId}`
  )

  try {
    const { items } = await listAll(cardFolderRef)
    await Promise.all(items.map((fileRef) => deleteObject(fileRef)))
  } catch (error) {
    console.error('Error deleting files from firebase storage:', error)
  }
}
