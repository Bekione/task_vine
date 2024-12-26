"use client";

import { motion } from "framer-motion";
import { Todo, TodoStatus } from "@/types/todo";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTodoCard } from "./sortable-todo-card";
import React, { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TodoColumnProps {
  title: string;
  status: TodoStatus;
  todos: Todo[];
  onDeleteTodo: (todo: Todo) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function TodoColumn({
  title,
  status,
  todos,
  onDeleteTodo,
  isLoading = false,
  error = null,
}: TodoColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Sort todos by priority (high -> medium -> low -> none)
  const sortedTodos = useMemo(() => {
    const priorityOrder = {
      high: 0,
      medium: 1,
      low: 2,
      none: 3,
    };

    return [...todos].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [todos]);

  const todoIds = useMemo(
    () => sortedTodos.map((todo) => todo.id),
    [sortedTodos]
  );

  const getEmptyMessage = (status: TodoStatus) => {
    switch (status) {
      case "todo":
        return "No todos yet";
      case "in-progress":
        return "No tasks in progress";
      case "done":
        return "No completed tasks";
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="h-[calc(100vh-280px)] p-4 flex items-center justify-center">
          <p className="text-destructive">Error: {error}</p>
        </div>
      );
    }

    return (
      <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
        <div className="space-y-4 min-h-full overflow-hidden">
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => (
              <SortableTodoCard
                key={todo.id}
                todo={todo}
                onDelete={onDeleteTodo}
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
    );
  };

  return (
    <div className="flex-1 w-full min-w-[300px] flex flex-col">
      <h2 className="text-2xl font-space font-bold text-foreground dark:text-white mb-4">
        {title}
      </h2>
      <motion.div
        ref={setNodeRef}
        className={`flex-1 rounded-lg backdrop-blur-md bg-secondary/50 
          border-2 transition-colors duration-200 shadow-lg
          ${isOver ? "border-primary/50" : "border-border"}
          shadow-xl`}
      >
        <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
          <div className="h-[calc(100vh-280px)]">
            {isLoading ? (
              <div className="h-[calc(100vh-280px)] p-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton className="h-24 w-full" key={i} />
                  ))}
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </SortableContext>
      </motion.div>
    </div>
  );
}
