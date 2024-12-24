'use client'

import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TodoColumn } from '@/components/todo-column'
import { AddTodoDialog } from '@/components/add-todo-dialog'
import { useTodos } from '@/hooks/use-todos'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { useState } from 'react'
import { Todo, TodoStatus } from '@/types/todo'
import { TodoCard } from '@/components/todo-card'
import { TaskTimer } from '@/components/task-timer'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showAddDialog = searchParams.get('add-todo') !== null
  const { todos, addTodo, updateTodoStatus, deleteTodo, reorderTodos } = useTodos()
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveTodo(todos.find(todo => todo.id === active.id) || null)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeTodo = todos.find((todo) => todo.id === activeId)
    if (!activeTodo) return

    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      updateTodoStatus(activeId, overId as TodoStatus)
    } else {
      const oldIndex = todos.findIndex((todo) => todo.id === activeId)
      const newIndex = todos.findIndex((todo) => todo.id === overId)
      reorderTodos(arrayMove(todos, oldIndex, newIndex))
    }

    setActiveTodo(null)
  }

  const handleDragCancel = () => {
    setActiveTodo(null)
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <main className="container mx-auto p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-space font-bold text-foreground">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={() => router.push('/?add-todo')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white"
            >
              <Plus className="mr-2" /> Add New Todo
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TodoColumn
              title="Todo"
              status="todo"
              todos={todos.filter((todo) => todo.status === 'todo')}
              onDelete={deleteTodo}
            />
            <TodoColumn
              title="In Progress"
              status="in-progress"
              todos={todos.filter((todo) => todo.status === 'in-progress')}
              onDelete={deleteTodo}
            />
            <TodoColumn
              title="Done"
              status="done"
              todos={todos.filter((todo) => todo.status === 'done')}
              onDelete={deleteTodo}
            />
          </div>
          <DragOverlay>
            {activeTodo ? <TodoCard todo={activeTodo} onDelete={() => {}} /> : null}
          </DragOverlay>
        </DndContext>

        <TaskTimer />
        

        <AddTodoDialog
          isOpen={showAddDialog}
          onClose={() => router.push('/')}
          onAdd={addTodo}
        />
      </main>
      <Footer />
    </div>
  )
}

