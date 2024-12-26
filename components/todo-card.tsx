"use client";

import { motion } from "framer-motion";
import { Trash2, Edit } from "lucide-react";
import { PriorityLevel, Todo, TodoStatus } from "@/types/todo";
import { useTodoStore } from "@/lib/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";

interface TodoCardProps {
  todo: Todo;
  onDelete?: (id: string) => void;
}

export function TodoCard({ todo, onDelete }: TodoCardProps) {
  const router = useRouter();
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case "todo":
        return "bg-background/80 dark:bg-white/10";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-500/20";
      case "done":
        return "bg-green-300 dark:bg-green-500/20";
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/?edit-todo=${todo.id}`);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isDeleting) return;
    setIsDeleting(true);
    removeTodo(todo.id);
    onDelete?.(todo.id);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const getBorderColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-transparent';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-lg backdrop-blur-sm ${getStatusColor(
        todo.status
      )} 
        shadow-lg transition-colors duration-300 relative
        border-l-[6px] ${getBorderColor(todo.priority)}`}
    >
      {/* Main Content Area - Draggable */}
      <div className="drag-handle cursor-move">
        <h3 className="w-10/12 font-space font-bold text-foreground break-words">
          {todo.title}
        </h3>
        <p className="w-full text-sm text-muted-foreground mt-2 break-words">
          {todo.description}
        </p>
        {todo.status === "done" && todo.timeSpent > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Time spent: {formatTime(todo.timeSpent)}
          </p>
        )}
      </div>

      {todo.priority !== 'none' && (
          <div className="absolute bottom-2 right-2">
            <Badge title="Priority" variant={
              todo.priority === 'high' 
                ? 'destructive' 
                : todo.priority === 'medium' 
                  ? 'secondary' 
                  : 'default'
            }>
              {todo.priority}
            </Badge>
          </div>
        )}

      {/* Actions Area */}
      <div
        className="absolute top-2 right-2 flex gap-2 z-50 pointer-events-auto"
        data-no-dnd
      >
        {todo.status === "todo" && (
          <button
            onClick={handleEdit}
            className="p-1 rounded-md bg-background/90 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Edit size={18} />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-1 rounded-md bg-background/90 text-gray-400 hover:text-red-400 transition-colors
      ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
