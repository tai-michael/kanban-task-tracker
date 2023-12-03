export type ID = string

// export type Boards = Board[] // probably unnecessary

export interface BoardMeta {
  id: ID
  title: string
}

export interface BoardDetails {
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
  due_date: string // TODO change later probably to 'Date'
  checklist_progress: string // TODO change later probably
}

export interface CardDescription {
  id: ID
  boardId: ID
  description: string
  checklist: ChecklistItem[]
  attachments: string // TODO change later
}

export interface ChecklistItem {
  id: ID
  name: string
  unsavedName: string
  isCompleted: boolean
}
