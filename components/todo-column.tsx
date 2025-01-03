"use client";

import { motion } from "framer-motion";
import { Todo, TodoStatus } from "@/types/todo";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTodoCard } from "./sortable-todo-card";
import React, { useMemo, useRef } from "react";
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
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        <div className="flex items-center justify-center h-full">
          <p className="text-destructive">Error: {error}</p>
        </div>
      );
    }

    return (
      <>
        {sortedTodos.length > 0 ? (
          sortedTodos.map((todo) => (
            <SortableTodoCard
              key={todo.id}
              todo={todo}
              onDelete={onDeleteTodo}
            />
          ))
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-muted-foreground text-sm">
              {getEmptyMessage(status)}
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex-1 w-full min-w-[300px] flex flex-col">
      <h2 className="text-2xl font-space font-bold text-foreground dark:text-white mb-4">
        {title}
      </h2>
      <motion.div
        ref={setNodeRef}
        className={`flex-1 min-h-[380px] rounded-lg backdrop-blur-md bg-secondary/50 
          border-2 transition-colors duration-200 shadow-lg
          ${isOver ? "border-primary/50" : "border-border"}
          shadow-xl relative`}
      >
        <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
          <div 
            ref={scrollContainerRef}
            className="absolute inset-0 overflow-y-auto scroll-smooth"
          >
            <div className="min-h-full p-4 relative">
              <div className="space-y-4">
                {isLoading ? (
                  ['በ', 'ረ', 'ከ', 'ት'].map((i) => (
                    <Skeleton className="h-24 w-full" key={i} />
                  ))
                ) : (
                  renderContent()
                )}
              </div>
              <div className="h-2"></div>
            </div>
          </div>
        </SortableContext>
      </motion.div>
    </div>
  );
}
