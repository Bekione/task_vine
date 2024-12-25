export type TodoStatus = 'todo' | 'in-progress' | 'done'

// Add a constant for the default status
export const DEFAULT_TODO_STATUS: TodoStatus = 'todo'

export interface Todo {
  id: string
  title: string
  description?: string
  status: TodoStatus
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
  addTodo:  (title: string, description?: string) => void
  dragTodo: (id: string | null) => void
  removeTodo: (id: string) => void
  updateTodo: (id: string, status: TodoStatus) => void
  reorderTodo: (newTodos: Todo[]) => void
  editTodo: (id: string, title: string, description?: string) => void
  startTaskTimer: (todoId: string) => void
  stopTaskTimer: (todoId: string) => void
  updateTimeSpent: (todoId: string, seconds: number) => void
}
