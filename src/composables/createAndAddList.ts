import { useBoardStore } from '@/stores'
import { v4 as uuidv4 } from 'uuid'

export default function (title: string) {
  const store = useBoardStore()

  const listId = uuidv4()
  const newList = {
    title: title,
    id: listId,
    cards: [],
  }

  store.addList(newList)
}
