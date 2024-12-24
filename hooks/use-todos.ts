'use client'

import { useState } from 'react'
import { Todo, TodoStatus } from '@/types/todo'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Repair the oven',
      description: 'disassemble our oven and assemble back tightening the screws',
      status: 'todo',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Learn zustand',
      description: 'follow zustand yt video and build a project that uses zustand',
      status: 'in-progress',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Update portfolio',
      description: 'Add recent projects and update skills section',
      status: 'todo',
      createdAt: new Date(),
    },
    {
      id: '4',
      title: 'Read documentation',
      description: 'Go through the Next.js 14 documentation',
      status: 'todo',
      createdAt: new Date(),
    },
    {
      id: '5',
      title: 'Write blog post',
      description: 'Write about my experience with Zustand',
      status: 'todo',
      createdAt: new Date(),
    }
  ])

  const addTodo = (title: string, description: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      status: 'todo',
      createdAt: new Date(),
    }
    setTodos([...todos, newTodo])
  }

  const updateTodoStatus = (id: string, status: TodoStatus) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const reorderTodos = (items: Todo[]) => {
    setTodos(items)
  }

  return {
    todos,
    addTodo,
    updateTodoStatus,
    deleteTodo,
    reorderTodos,
  }
}

