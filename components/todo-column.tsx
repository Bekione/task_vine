'use client'

import { motion } from 'framer-motion'
import { Todo, TodoStatus } from '@/types/todo'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTodoCard } from './sortable-todo-card'
import { useMemo } from 'react'

interface TodoColumnProps {
  title: string
  status: TodoStatus
  todos: Todo[]
}

export function TodoColumn({ title, status, todos }: TodoColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const todoIds = useMemo(() => todos.map(todo => todo.id), [todos])

  return (
    <div className="flex-1 w-full min-w-[300px] flex flex-col">
      <h2 className="text-2xl font-space font-bold text-foreground dark:text-white mb-4">
        {title}
      </h2>
      <motion.div
        ref={setNodeRef}
        className={`flex-1 rounded-lg backdrop-blur-md bg-secondary/50 
          border-2 transition-colors duration-200 shadow-lg
          ${isOver ? 'border-primary/50' : 'border-border'}
          shadow-xl`}
      >
        <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
          <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
            <div className="space-y-4 min-h-full">
              {todos.map((todo) => (
                <SortableTodoCard 
                  key={todo.id} 
                  todo={todo}
                />
              ))}
              <div className="h-2" />
            </div>
          </div>
        </SortableContext>
      </motion.div>
    </div>
  )
}

