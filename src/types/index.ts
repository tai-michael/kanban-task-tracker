export type ID = string

// export type Boards = Board[]

export interface Board {
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
  checklist_progress: string // change later probably
}

export interface CardDescription {
  id: ID
  boardId: ID
  description: string
  checklist: ChecklistItem[]
  attachments: string // change later
}

export interface ChecklistItem {
  id: ID
  name: string
  unsavedName: string
  isCompleted: boolean
}
