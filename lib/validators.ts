import { Todo, TodoStatus, PriorityLevel } from "@/types/todo";

export function isValidTodo(todo: any): todo is Todo {
  const validStatuses: TodoStatus[] = ['todo', 'in-progress', 'done'];
  const validPriorities: PriorityLevel[] = ['high', 'medium', 'low', 'none'];

  try {
    return (
      typeof todo === 'object' &&
      typeof todo.id === 'string' &&
      typeof todo.title === 'string' &&
      (!todo.description || typeof todo.description === 'string') &&
      validStatuses.includes(todo.status) &&
      validPriorities.includes(todo.priority) &&
      typeof todo.timeSpent === 'number' &&
      todo.timeSpent >= 0 &&
      Array.isArray(todo.timeLog) &&
      !isNaN(new Date(todo.createdAt).getTime())
    );
  } catch {
    return false;
  }
} 