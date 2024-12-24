"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit } from "lucide-react";
import { Todo, TodoStatus } from "@/types/todo";
import { useTodoStore } from "@/lib/store";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    e.stopPropagation();
    router.push(`/?edit-todo=${todo.id}`);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Deletion is happinging")
    if (isDeleting) return;

    setIsDeleting(true);

    // Wait for animation to complete before removing from state
    setTimeout(() => {
      removeTodo(todo.id);
      onDelete?.(todo.id);
      console.log("Deletion is done.")
    }, 200); // Match this duration with the Framer Motion `exit` animation time
  };

  return (
    // <AnimatePresence>
      <div
        // layout
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: -20 }}
        // transition={{ duration: 0.2 }} // Ensure this matches the `setTimeout` duration
        className={`p-4 rounded-lg backdrop-blur-sm ${getStatusColor(
          todo.status
        )} 
    shadow-lg transition-colors duration-300`}
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-space font-bold text-foreground">
              {todo.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {todo.description}
            </p>
          </div>
          <div className="flex gap-2">
            {todo.status === 'todo' && (
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Edit size={18} />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`text-gray-400 hover:text-red-400 transition-colors
                ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    // </AnimatePresence> 
  );
}
