export type TodoStatus = 'todo' | 'in-progress' | 'done'

// Add a constant for the default status
export const DEFAULT_TODO_STATUS: TodoStatus = 'todo'

export type PriorityLevel = 'high' | 'medium' | 'low' | 'none'

export interface Todo {
  id: string
  title: string
  description?: string
  status: TodoStatus
  priority: PriorityLevel
  createdAt: Date
  timeSpent: number // Total seconds spent on this todo
  timeLog: TimeLogEntry[] // History of time entries
}

export interface TimeLogEntry {
  startTime: Date
  endTime?: Date
  duration: number // in seconds
}

export type State = {
  todos: Todo[],
  draggedTodo: string | null
}

export type Actions = {
  addTodo: (title: string, description?: string, priority?: PriorityLevel) => void
  dragTodo: (id: string | null) => void
  removeTodo: (id: string) => void
  updateTodo: (id: string, status: TodoStatus) => void
  reorderTodo: (newTodos: Todo[]) => void
  editTodo: (id: string, title: string, description?: string, priority?: PriorityLevel) => void
  startTaskTimer: (todoId: string) => void
  stopTaskTimer: (todoId: string) => void
  updateTimeSpent: (todoId: string, seconds: number) => void
}

// Update DEFAULT_TODO_STATUS to include priority
export const DEFAULT_TODO = {
  status: 'todo' as TodoStatus,
  priority: 'none' as PriorityLevel,
} as const

// Update the default values
export const DEFAULT_PRIORITY: PriorityLevel = 'medium'
