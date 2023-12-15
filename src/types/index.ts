export type ID = string

// export type Boards = Board[] // probably unnecessary

export interface BoardMeta {
  id: ID
  title: string
}

export interface BoardDetails {
  created_by: ID
  id: ID
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
  due_date: Date
  is_completed: boolean
  checklist_progress: string // TODO change later probably
}

export interface CardDescription {
  id: ID
  boardId: ID
  created_by: ID
  description: string
  checklist: ChecklistItem[]
  attachments: string // TODO change later
}

export interface ChecklistItem {
  id: ID
  name: string
  unsaved_name: string
  is_completed: boolean
}
