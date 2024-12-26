import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from "nanoid"
import { TodoStatus, State, Actions, DEFAULT_TODO_STATUS, PriorityLevel, DEFAULT_PRIORITY, AddTodoParams } from '@/types/todo'

export const useTodoStore = create<State & Actions>()(
  persist(
    (set, get) => ({
        todos: [],
        draggedTodo: null,
        timer: {
            selectedTodoId: null,
            isRunning: false,
            currentTime: 0
        },
        addTodo: (params: AddTodoParams) => set(({ todos }) => ({
            todos: [
                {
                    id: nanoid(),
                    title: params.title,
                    description: params.description || '',
                    status: params.status || DEFAULT_TODO_STATUS,
                    priority: params.priority || DEFAULT_PRIORITY,
                    timeSpent: params.timeSpent || 0,
                    createdAt: new Date(),
                    timeLog: []
                },
                ...todos,
            ],
        })),
        dragTodo: (id: string | null) => set(() => ({ draggedTodo: id })),
        removeTodo: (id: string) => {
            const currentTodos = get().todos
            const newTodos = currentTodos.filter(todo => todo.id !== id)
            set({ todos: newTodos })
        },
        updateTodo: (id: string, status: TodoStatus) => set((state) => {
            const todo = state.todos.find(t => t.id === id);
            if (!todo) return { todos: state.todos };

            if (id === state.timer.selectedTodoId) {
                if (status === 'done') {
                    set(() => ({
                        timer: {
                            selectedTodoId: null,
                            isRunning: false,
                            currentTime: 0
                        }
                    }));
                } else if (status === 'todo') {
                    set(() => ({
                        timer: {
                            selectedTodoId: null,
                            isRunning: false,
                            currentTime: 0
                        }
                    }));
                }
            }

            return {
                todos: state.todos.map(t => {
                    if (t.id === id) {
                        if (status === 'todo') {
                            return { ...t, status, timeSpent: 0, timeLog: [] };
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
        setSelectedTodo: (todoId: string | null) => set((state) => ({
            timer: {
                ...state.timer,
                selectedTodoId: todoId,
                currentTime: todoId ? (get().todos.find(t => t.id === todoId)?.timeSpent || 0) : 0
            }
        })),
        setTimerRunning: (isRunning: boolean) => set((state) => ({
            timer: { ...state.timer, isRunning }
        })),
        setCurrentTime: (time: number) => set((state) => ({
            timer: { ...state.timer, currentTime: time }
        })),
        resetTimer: () => set((state) => ({
            timer: { ...state.timer, currentTime: 0, isRunning: false }
        })),
        exportData: () => {
            const data = get().todos;
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `taskvine-export-${new Date().toISOString()}.json`;
            a.click();
        },
        importData: async (file: File) => {
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                set({ todos: data });
            } catch (error) {
                console.error('Error importing data:', error);
            }
        },
    }),
    {
      name: 'todo-storage',
    }
  )
)