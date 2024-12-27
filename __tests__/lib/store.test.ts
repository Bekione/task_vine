import { create } from 'zustand'
import { useTodoStore } from '@/lib/store'
import { State, Actions } from '@/types/todo'
import { StoreApi } from 'zustand'

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id'
}))

describe('Todo Store', () => {
  let store: StoreApi<State & Actions>

  beforeEach(() => {
    store = useTodoStore
    store.setState({
      todos: [],
      draggedTodo: null,
      timer: {
        isRunning: false,
        selectedTodoId: null,
        currentTime: 0
      }
    })
  })

  it('should add a todo', () => {
    const newTodo = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'high' as const
    }

    store.getState().addTodo(newTodo)
    
    const todos = store.getState().todos
    expect(todos).toHaveLength(1)
    expect(todos[0]).toMatchObject({
      ...newTodo,
      id: expect.any(String),
      status: 'todo',
      timeSpent: 0,
      createdAt: expect.any(Date),
      timeLog: []
    })
  })

  it('should update a todo', () => {
    const todo = {
      id: 'test-id',
      title: 'Test Todo',
      description: 'Test Description',
      status: 'todo' as const,
      priority: 'high' as const,
      timeSpent: 0,
      createdAt: new Date(),
      timeLog: []
    }

    store.setState({ todos: [todo] })
    store.getState().updateTodo('test-id', 'in-progress')
    
    const updatedTodo = store.getState().todos[0]
    expect(updatedTodo.status).toBe('in-progress')
  })
}) 