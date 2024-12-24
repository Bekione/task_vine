export type TodoStatus = 'todo' | 'in-progress' | 'done'

export interface Todo {
  id: string
  title: string
  description: string
  status: TodoStatus
  createdAt: Date
}

