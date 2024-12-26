"use client";

import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { TodoColumn } from '@/components/todo-column'
import { useTodoStore } from '@/lib/store'
import { AddTodoDialog } from '@/components/add-todo-dialog'
import { useRouter, useSearchParams } from 'next/navigation'
import { DragOverlay } from '@dnd-kit/core'
import { TodoCard } from '@/components/todo-card'
import { useEffect, useState } from 'react'
import { TodoStatus } from '@/types/todo'
import Image from 'next/image'

function TodoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showAddDialog = searchParams.has('add-todo')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const todos = useTodoStore(state => state.todos)
  const draggedTodo = useTodoStore(state => state.draggedTodo)
  const dragTodo = useTodoStore(state => state.dragTodo)
  const updateTodo = useTodoStore(state => state.updateTodo)
  const reorderTodo = useTodoStore(state => state.reorderTodo)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const columns: { title: string; status: TodoStatus }[] = [
    { title: 'Todo', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Done', status: 'done' },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    dragTodo(event.active.id as string)
  }

  const handleDragEnd = () => {
    dragTodo(null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTodo = todos.find(todo => todo.id === activeId)
    const overStatus = overId as TodoStatus

    if (activeTodo && overStatus) {
      updateTodo(activeTodo.id, overStatus)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <h1 className="text-4xl font-space font-bold text-foreground">
            TaskVine
          </h1>
        </div>
        <button
          onClick={() => router.push('/?add-todo')}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Add Todo
        </button>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(({ title, status }) => (
            <TodoColumn
              key={status}
              title={title}
              status={status}
              todos={todos.filter(todo => todo.status === status)}
              isLoading={isLoading}
              error={error}
            />
          ))}
        </div>

        <DragOverlay>
          {draggedTodo ? (
            <div className="transform rotate-3">
              <TodoCard todo={todos.find(t => t.id === draggedTodo)!} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTodoDialog isOpen={showAddDialog} onClose={() => router.push("/")} />
    </>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8 flex flex-col">
        <TodoContent />
      </main>
    </div>
  )
}
