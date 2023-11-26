import { useBoardStore } from '@/stores'
import { db } from '@/firebaseInit'
import { doc, deleteDoc } from 'firebase/firestore'

export default function (cardId: string) {
  const store = useBoardStore()

  store.removeCard(cardId)
  deleteDoc(doc(db, 'cards', cardId))
}
