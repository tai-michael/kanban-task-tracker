import { db } from '@/firebaseInit'
import { setDoc, doc } from 'firebase/firestore'
import debounce from 'lodash/debounce'

const updateFirestoreDoc = async (
  collectionId: string,
  documentId: string,
  newDoc
) => {
  try {
    const docRef = doc(db, collectionId, documentId)
    await setDoc(docRef, newDoc)
    console.log('Updated backend with new board')
  } catch (err) {
    console.error('Failed to update backend:', err)
  }
}

export default debounce(updateFirestoreDoc, 1500)
