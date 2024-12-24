'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TodoCard } from './todo-card'
import { Todo } from '@/types/todo'
import { useTodoStore } from '@/lib/store'
import { useEffect } from 'react'

interface SortableTodoCardProps {
  todo: Todo
}

export function SortableTodoCard({ todo }: SortableTodoCardProps) {
  const dragTodo = useTodoStore(state => state.dragTodo)
  
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

  useEffect(() => {
    if (isDragging) {
      dragTodo(todo.id);
    } else if (!isDragging && useTodoStore.getState().draggedTodo === todo.id) {
      dragTodo(null);
    }
  }, [isDragging, todo.id, dragTodo]);

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
      <TodoCard todo={todo} />
    </div>
  )
}

