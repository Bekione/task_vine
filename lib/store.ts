import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from "nanoid"
import { TodoStatus, State, Actions, DEFAULT_TODO_STATUS, PriorityLevel, DEFAULT_PRIORITY, AddTodoParams, ImportResult } from '@/types/todo'
import { isValidTodo } from "./validators";
import { toast } from "@/components/ui/use-toast"

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
            
            if (id === get().timer.selectedTodoId) {
                set(() => ({
                    todos: newTodos,
                    timer: {
                        selectedTodoId: null,
                        isRunning: false,
                        currentTime: 0
                    }
                }))
            } else {
                set({ todos: newTodos })
            }
        },
        updateTodo: (id: string, status: TodoStatus) => set((state) => {
            const todo = state.todos.find(t => t.id === id);
            if (!todo) return { todos: state.todos };

            if (id === state.timer.selectedTodoId && todo.status === 'in-progress' && status !== 'in-progress') {
                return {
                    todos: state.todos.map(t => {
                        if (t.id === id) {
                            return { ...t, status };
                        }
                        return t;
                    }),
                    timer: {
                        selectedTodoId: null,
                        isRunning: false,
                        currentTime: 0
                    }
                };
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
        importData: async (file: File): Promise<ImportResult> => {
            try {
                if (file.size > 5 * 1024 * 1024) {
                    return { error: "File size too large. Maximum size is 5MB." };
                }

                if (!file.type.includes('application/json')) {
                    return { error: "Invalid file type. Please upload a JSON file." };
                }

                const text = await file.text();
                const data = JSON.parse(text);

                if (!Array.isArray(data)) {
                    return { error: "Invalid data format. Expected an array of todos." };
                }

                const processedData = data.map(todo => ({
                    ...todo,
                    createdAt: new Date(todo.createdAt)
                }));

                const validTodos = processedData.filter(todo => isValidTodo(todo));
                
                if (validTodos.length === 0) {
                    return { error: "No valid todos found in the file." };
                }

                if (validTodos.length !== data.length) {
                    toast({
                        title: "Warning",
                        description: `${data.length - validTodos.length} invalid todos were skipped.`,
                        variant: "default"
                    });
                }

                set({ todos: validTodos });
                return { success: true };
            } catch (error) {
                console.error('Error importing data:', error);
                return { error: "Failed to process the file. Please try again." };
            }
        },
        clearTodos: () => set({ todos: [] }),
    }),
    {
      name: 'todo-storage',
    }
  )
)