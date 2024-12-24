export type TodoStatus = 'todo' | 'in-progress' | 'done'

// Add a constant for the default status
export const DEFAULT_TODO_STATUS: TodoStatus = 'todo'

export interface Todo {
  id: string
  title: string
  description?: string
  status: TodoStatus
  createdAt: Date
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
}
