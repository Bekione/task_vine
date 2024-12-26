"use client";

import { useState, Suspense, useMemo } from "react";
import Image from "next/image";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TodoColumn } from "@/components/todo-column";
import { AddTodoDialog } from "@/components/add-todo-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import { Todo, TodoStatus } from "@/types/todo";
import { TodoCard } from "@/components/todo-card";
import { TaskTimer } from "@/components/task-timer";
import { useTodoStore } from "@/lib/store";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useToast } from "@/components/ui/use-toast";

// Create a custom pointer sensor
class CustomPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const, // Explicit literal type for 'eventName'
      handler: ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
        // Prevent drag if the target is within an element with 'data-no-dnd'
        if ((nativeEvent.target as HTMLElement).closest("[data-no-dnd]")) {
          return false;
        }
        return true;
      },
    },
  ];
}

function TodoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showAddDialog =
    searchParams.get("add-todo") !== null ||
    searchParams.get("edit-todo") !== null;
  const { updateTodo, reorderTodo, removeTodo, addTodo } = useTodoStore();
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const todos = useTodoStore((state) => state.todos);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const { toast } = useToast();

  const todosByStatus = useMemo(() => {
    return (status: TodoStatus) =>
      todos.filter((todo) => todo.status === status);
  }, [todos]);

  const sensors = useSensors(
    useSensor(CustomPointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTodo(todos.find((todo) => todo.id === active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTodo = todos.find((todo) => todo.id === activeId);
    if (!activeTodo) return;

    if (overId === "todo" || overId === "in-progress" || overId === "done") {
      updateTodo(activeId.toString(), overId as TodoStatus);
    } else {
      const oldIndex = todos.findIndex(
        (todo) => todo.id === activeId.toString()
      );
      const newIndex = todos.findIndex((todo) => todo.id === overId);
      reorderTodo(arrayMove(todos, oldIndex, newIndex));
    }

    setActiveTodo(null);
  };

  const handleDragCancel = () => {
    setActiveTodo(null);
  };

  const handleDeleteTodo = (todo: Todo) => {
    setTodoToDelete(todo);
  };

  const handleConfirmDelete = () => {
    if (!todoToDelete) return;

    const todoBackup = { ...todoToDelete };
    removeTodo(todoToDelete.id);

    toast({
      title: "Todo deleted",
      description: "The todo has been removed",
      action: (
        <button
          onClick={(e) => {
            (e.target as HTMLButtonElement).disabled = true;
            addTodo({
              title: todoBackup.title,
              description: todoBackup.description,
              priority: todoBackup.priority,
              status: todoBackup.status,
              timeSpent: todoBackup.timeSpent
            });
            toast({ duration: 0 });
          }}
          className="text-sm font-medium underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo
        </button>
      ),
    });

    setTodoToDelete(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-lg w-auto h-auto"
          />
          <h1 className="hidden md:flex text-3xl font-space font-bold text-foreground">
            TaskVine
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            onClick={() => router.push("/?add-todo")}
            className="bg-gradient-to-r from-[#3dc6ee] to-[#75d7f1] hover:opacity-90 text-white"
          >
            <Plus className="mr-2" /> Add New Todo
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TodoColumn
            title="Todo"
            status="todo"
            todos={todosByStatus("todo")}
            onDeleteTodo={handleDeleteTodo}
          />
          <TodoColumn
            title="In Progress"
            status="in-progress"
            todos={todosByStatus("in-progress")}
            onDeleteTodo={handleDeleteTodo}
          />
          <TodoColumn
            title="Done"
            status="done"
            todos={todosByStatus("done")}
            onDeleteTodo={handleDeleteTodo}
          />
        </div>
        <DragOverlay>
          {activeTodo ? (
            <div className="transform rotate-3">
              <TodoCard todo={activeTodo} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTodoDialog isOpen={showAddDialog} onClose={() => router.push("/")} />

      <ConfirmationDialog
        isOpen={!!todoToDelete}
        onClose={() => setTodoToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Todo"
        description="Are you sure you want to delete this todo? This action cannot be undone."
      />
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <main className="container mx-auto p-8 pb-2 flex flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <TodoContent />
        </Suspense>
      </main>
      <Footer />
      <TaskTimer />
    </div>
  );
}
