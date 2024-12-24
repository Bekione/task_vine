'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TodoCard } from './todo-card'
import { Todo } from '@/types/todo'

interface SortableTodoCardProps {
  todo: Todo
  onDelete: (id: string) => void
}

export function SortableTodoCard({ todo, onDelete }: SortableTodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: todo.id,
    data: {
      type: 'todo',
      todo,
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none relative"
    >
      <TodoCard todo={todo} onDelete={onDelete} />
    </div>
  )
}

