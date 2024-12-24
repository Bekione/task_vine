'use client'

import { motion } from 'framer-motion'
import { Todo, TodoStatus } from '@/types/todo'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTodoCard } from './sortable-todo-card'

interface TodoColumnProps {
  title: string
  status: TodoStatus
  todos: Todo[]
  onDelete: (id: string) => void
}

export function TodoColumn({ title, status, todos, onDelete }: TodoColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div className="flex-1 w-full min-w-[300px] flex flex-col">
      <h2 className="text-2xl font-space font-bold text-foreground dark:text-white mb-4">{title}</h2>
      <motion.div
        ref={setNodeRef}
        className={`flex-1 rounded-lg backdrop-blur-md bg-secondary/50 
          border-2 transition-colors duration-200
          ${isOver ? 'border-primary/50' : 'border-border'}
          shadow-md`}
      >
        <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
          <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
            <div className="space-y-4 min-h-full">
              {todos.map((todo) => (
                <SortableTodoCard key={todo.id} todo={todo} onDelete={onDelete} />
              ))}
              <div className="h-2" />
            </div>
          </div>
        </SortableContext>
      </motion.div>
    </div>
  )
}

