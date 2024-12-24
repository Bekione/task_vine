import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from "nanoid"
import { TodoStatus, State, Actions, DEFAULT_TODO_STATUS } from '@/types/todo'


export const useTodoStore = create<State & Actions>()(
  persist(
    (set, get) => ({
        todos: [],
        draggedTodo: null,
        addTodo: (title: string, description?: string) => set((state) => ({
            todos: [
                ...state.todos, 
                {
                    id: nanoid(), 
                    title, 
                    description, 
                    status: DEFAULT_TODO_STATUS,
                    createdAt: new Date()
                }
            ]
        })),
        dragTodo: ( id: string | null) => set({ draggedTodo: id }),
        removeTodo: (id: string) => {
            const currentTodos = get().todos
            const newTodos = currentTodos.filter(todo => todo.id !== id)
            set({ todos: newTodos })
        },
        updateTodo: (id: string, status: TodoStatus) => set((state) => ({
            todos: state.todos.map(todo => 
                todo.id === id ? { ...todo, status } : todo
            )
        })),
        reorderTodo: (newTodos: State['todos']) => set({ todos: newTodos })
    }),
    {
      name: 'todo-storage',
    }
  )
)