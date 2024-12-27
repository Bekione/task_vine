import { render, screen } from '@testing-library/react'
import { TodoColumn } from '@/components/todo-column'
import { Todo } from '@/types/todo'
import { useTodoStore } from '@/lib/store'
import { State, Actions } from '@/types/todo'
import { ForwardedRef, PropsWithChildren } from 'react'

// Mock the store with getState
const mockStore = {
  getState: jest.fn().mockReturnValue({ draggedTodo: null }),
  setState: jest.fn(),
  subscribe: jest.fn(),
  destroy: jest.fn(),
}

jest.mock('@/lib/store', () => ({
  useTodoStore: jest.fn<Partial<State & Actions>, []>().mockImplementation(() => ({
    todos: [],
    draggedTodo: null,
    dragTodo: jest.fn()
  }))
}))

// Assign getState to the mocked store
;(useTodoStore as any).getState = () => mockStore.getState()

// Mock framer-motion more completely
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, ...props }: any) => (
      <div data-testid="motion-div" data-layout={layout} {...props}>
        {children}
      </div>
    )
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  Reorder: {
    Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Item: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  }
}))

describe('TodoColumn', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'high',
    timeSpent: 0,
    createdAt: new Date(),
    timeLog: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders column title and todos', () => {
    render(
      <TodoColumn
        title="To Do"
        status="todo"
        todos={[mockTodo]}
        onDeleteTodo={() => {}}
      />
    )

    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument()
  })
}) 