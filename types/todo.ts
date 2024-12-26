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

export interface TimerState {
  selectedTodoId: string | null;
  isRunning: boolean;
  currentTime: number;
}

export interface State {
  todos: Todo[];
  draggedTodo: string | null;
  timer: TimerState;
}

export interface Actions {
  addTodo: (params: AddTodoParams) => void;
  dragTodo: (id: string | null) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, status: TodoStatus) => void;
  reorderTodo: (newTodos: Todo[]) => void;
  editTodo: (id: string, title: string, description?: string, priority?: PriorityLevel) => void;
  startTaskTimer: (todoId: string) => void;
  stopTaskTimer: (todoId: string) => void;
  updateTimeSpent: (todoId: string, seconds: number) => void;
  setSelectedTodo: (todoId: string | null) => void;
  setTimerRunning: (isRunning: boolean) => void;
  setCurrentTime: (time: number) => void;
  resetTimer: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  clearTodos: () => void;
}

// Update DEFAULT_TODO_STATUS to include priority
export const DEFAULT_TODO = {
  status: 'todo' as TodoStatus,
  priority: 'none' as PriorityLevel,
} as const

// Update the default values
export const DEFAULT_PRIORITY: PriorityLevel = 'medium'

export interface AddTodoParams {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  status?: TodoStatus;
  timeSpent?: number;
}
