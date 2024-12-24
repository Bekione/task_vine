'use client'

import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Todo, TodoStatus } from '@/types/todo'

interface TodoCardProps {
  todo: Todo
  onDelete: (id: string) => void
}

export function TodoCard({ todo, onDelete }: TodoCardProps) {
  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case 'todo':
        return 'bg-background/80 dark:bg-white/10'
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-500/20'
      case 'done':
        return 'bg-green-300 dark:bg-green-500/20'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg backdrop-blur-sm ${getStatusColor(todo.status)} 
        shadow-lg transition-colors duration-300`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-space font-bold text-foreground">{todo.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  )
}

