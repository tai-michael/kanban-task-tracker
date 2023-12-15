import { db } from '@/firebaseInit'
import { setDoc, doc } from 'firebase/firestore'
import debounce from 'lodash/debounce'
import type { CardDescription, BoardDetails } from '@/types'

const updateDoc = async (collectionId: string, documentId: string, newDoc) => {
  try {
    if (!documentId) return // needed in case document has been removed from backend already

    const docRef = doc(db, collectionId, documentId)
    await setDoc(docRef, newDoc)
    console.log('Updated backend with new doc')
  } catch (err) {
    console.error('Failed to update backend:', err)
  }
}

// The function being stored in the debouncedUpdates map ensures that each collection/document pair has its own debounced function, thereby preventing an update to a collection from cancelling out a debounced update to a different collection
const debouncedUpdates = new Map()

const getDebouncedUpdate = (collectionId, documentId) => {
  const key = `${collectionId}:${documentId}`
  if (!debouncedUpdates.has(key)) {
    const debouncedUpdate = debounce(updateDoc, 500)
    debouncedUpdates.set(key, debouncedUpdate)
  }

  return debouncedUpdates.get(key)
}

export default async function (
  collectionId: string,
  documentId: string,
  newDoc: CardDescription | BoardDetails,
  useDebounce = true
) {
  if (useDebounce) {
    const debouncedUpdateFn = getDebouncedUpdate(collectionId, documentId)
    debouncedUpdateFn(collectionId, documentId, newDoc)
  } else {
    // Cancel any pending debounced calls before executing immediately
    const key = `${collectionId}:${documentId}`
    const debounced = debouncedUpdates.get(key)
    if (debounced) {
      debounced.cancel()
    }
    await updateDoc(collectionId, documentId, newDoc)
  }
}
