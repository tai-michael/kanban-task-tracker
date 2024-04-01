export type ID = string

export interface BoardsMeta {
  userId: string
  boards: BoardMeta[]
}

export interface BoardMeta {
  id: ID
  title: string
}

export interface BoardDetails {
  id: ID
  created_by: ID
  title: string
  lists: List[]
}

export interface List {
  id: ID
  title: string
  cards: CardSummary[]
}

export interface CardSummary {
  id: ID
  title: string
  due_date: Date | null
  is_completed: boolean
  checklist_items_completed: number
  checklist_items_total: number
  attachments_total: number
}

export interface CardDescription {
  id: ID
  boardId: ID
  created_by: ID
  description: string
  checklist: ChecklistItem[]
  attachments: CardAttachment[]
}

export interface ChecklistItem {
  id: ID
  name: string
  unsaved_name: string
  is_completed: boolean
}

export interface CardAttachment {
  originalName: string
  storageName: string
  url: string
}
