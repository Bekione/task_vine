import { render } from '@testing-library/react'
import { TaskTimer } from '@/components/task-timer'
import { useTodoStore } from '@/lib/store'
import { State, Actions } from '@/types/todo'

// Mock the store
jest.mock('@/lib/store', () => ({
  useTodoStore: jest.fn<Partial<State & Actions>, []>()
}))

describe('TaskTimer', () => {
  beforeEach(() => {
    // Setup default mock values
    (useTodoStore as jest.MockedFunction<typeof useTodoStore>).mockImplementation((selector) => {
      const state: State & Actions = {
        // State
        todos: [],
        draggedTodo: null,
        timer: {
          isRunning: false,
          selectedTodoId: null,
          currentTime: 0
        },
        // Actions
        addTodo: jest.fn(),
        editTodo: jest.fn(),
        updateTodo: jest.fn(),
        removeTodo: jest.fn(),
        dragTodo: jest.fn(),
        reorderTodo: jest.fn(),
        setSelectedTodo: jest.fn(),
        setTimerRunning: jest.fn(),
        setCurrentTime: jest.fn(),
        resetTimer: jest.fn(),
        updateTimeSpent: jest.fn(),
        startTaskTimer: jest.fn(),
        stopTaskTimer: jest.fn(),
        exportData: jest.fn(),
        importData: jest.fn(),
        clearTodos: jest.fn()
      }
      return selector(state)
    })
  })

  it('renders without crashing', () => {
    render(<TaskTimer />)
  })
})