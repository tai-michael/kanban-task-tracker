import { db } from '@/firebaseInit'
import { setDoc, doc } from 'firebase/firestore'
import debounce from 'lodash/debounce'
import type { Card, Board } from '@/types'

const updateDoc = async (collectionId: string, documentId: string, newDoc) => {
  try {
    const docRef = doc(db, collectionId, documentId)
    await setDoc(docRef, newDoc)
    console.log('Updated backend with new doc')
  } catch (err) {
    console.error('Failed to update backend:', err)
  }
}

const debouncedUpdateDoc = debounce(updateDoc, 500)

export default function (
  collectionId: string,
  documentId: string,
  newDoc,
  useDebounce = false
) {
  if (useDebounce) {
    debouncedUpdateDoc(collectionId, documentId, newDoc)
  } else {
    updateDoc(collectionId, documentId, newDoc)
  }
}
