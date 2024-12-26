'use client'

import { motion } from 'framer-motion'
import { Todo, TodoStatus } from '@/types/todo'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTodoCard } from './sortable-todo-card'
import React, { useMemo, useState } from 'react'

interface TodoColumnProps {
  title: string
  status: TodoStatus
  todos: Todo[]
}

export function TodoColumn({ title, status, todos }: TodoColumnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  // Sort todos by priority (high -> medium -> low -> none)
  const sortedTodos = useMemo(() => {
    const priorityOrder = {
      high: 0,
      medium: 1,
      low: 2,
      none: 3,
    };

    return [...todos].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [todos]);

  const todoIds = useMemo(() => sortedTodos.map(todo => todo.id), [sortedTodos]);

  const getEmptyMessage = (status: TodoStatus) => {
    switch (status) {
      case 'todo':
        return 'No todos yet';
      case 'in-progress':
        return 'No tasks in progress';
      case 'done':
        return 'No completed tasks';
    }
  };

  // Add loading skeleton
  if (isLoading) {
    return (
      <div className="flex-1 w-full min-w-[300px] animate-pulse">
        {/* Loading skeleton content */}
      </div>
    );
  }

  // Add error message
  if (error) {
    return (
      <div className="flex-1 w-full min-w-[300px] text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Add memo to prevent unnecessary re-renders
  const TodoItem = React.memo(({ todo }: { todo: Todo }) => {
    return <SortableTodoCard key={todo.id} todo={todo} />;
  });

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
            <div className="space-y-4 min-h-full overflow-hidden">
              {sortedTodos.length > 0 ? (
                sortedTodos.map((todo) => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo}
                  />
                ))
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    {getEmptyMessage(status)}
                  </p>
                </div>
              )}
              <div className="h-2" />
            </div>
          </div>
        </SortableContext>
      </motion.div>
    </div>
  )
}

