import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from "nanoid"
import { TodoStatus, State, Actions, DEFAULT_TODO_STATUS, PriorityLevel, DEFAULT_PRIORITY } from '@/types/todo'


export const useTodoStore = create<State & Actions>()(
  persist(
    (set, get) => ({
        todos: [],
        draggedTodo: null,
        addTodo: (title: string, description?: string, priority: PriorityLevel = DEFAULT_PRIORITY) => set((state) => ({
            todos: [
                ...state.todos, 
                {
                    id: nanoid(), 
                    title, 
                    description, 
                    status: DEFAULT_TODO_STATUS,
                    priority,
                    createdAt: new Date(),
                    timeSpent: 0,
                    timeLog: []
                }
            ]
        })),
        dragTodo: ( id: string | null) => set({ draggedTodo: id }),
        removeTodo: (id: string) => {
            const currentTodos = get().todos
            const newTodos = currentTodos.filter(todo => todo.id !== id)
            set({ todos: newTodos })
        },
        updateTodo: (id: string, status: TodoStatus) => set((state) => {
            const todo = state.todos.find(t => t.id === id);
            if (!todo) return { todos: state.todos };

            return {
                todos: state.todos.map(t => {
                    if (t.id === id) {
                        // Reset time when moving back to todo
                        if (status === 'todo') {
                            return { ...t, status, timeSpent: 0, timeLog: [] };
                        }
                        // Keep existing time when moving to in-progress
                        if (status === 'in-progress') {
                            return { ...t, status };
                        }
                        // Stop timer when moving to done
                        if (status === 'done') {
                            return { ...t, status };
                        }
                        return { ...t, status };
                    }
                    return t;
                })
            };
        }),
        reorderTodo: (newTodos: State['todos']) => set({ todos: newTodos }),
        editTodo: (id: string, title: string, description?: string, priority?: PriorityLevel) => set((state) => ({
            todos: state.todos.map(todo => 
                todo.id === id 
                    ? { ...todo, title, description, ...(priority && { priority }) }
                    : todo
            )
        })),
        startTaskTimer: (todoId: string) => {
            const todo = get().todos.find(t => t.id === todoId)
            if (!todo) return

            set((state) => ({
                todos: state.todos.map(t => 
                    t.id === todoId
                        ? {
                            ...t,
                            timeLog: [
                                ...t.timeLog || [],
                                { startTime: new Date(), duration: 0 }
                            ]
                        }
                        : t
                )
            }))
        },
        stopTaskTimer: (todoId: string) => {
            const todo = get().todos.find(t => t.id === todoId)
            if (!todo) return

            set((state) => ({
                todos: state.todos.map(t => 
                    t.id === todoId
                        ? {
                            ...t,
                            timeLog: t.timeLog?.map((log, i) => 
                                i === t.timeLog.length - 1
                                    ? { ...log, endTime: new Date() }
                                    : log
                            ) || []
                        }
                        : t
                )
            }))
        },
        updateTimeSpent: (todoId: string, seconds: number) => {
            set((state) => ({
                todos: state.todos.map(t => 
                    t.id === todoId
                        ? { ...t, timeSpent: seconds }
                        : t
                )
            }))
        },
        updatePriority: (id: string, priority: PriorityLevel) => set((state) => ({
            todos: state.todos.map(todo => 
                todo.id === id ? { ...todo, priority } : todo
            )
        })),
    }),
    {
      name: 'todo-storage',
    }
  )
)