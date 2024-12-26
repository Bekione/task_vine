import { Todo, TodoStatus, PriorityLevel } from "@/types/todo";

export function isValidTodo(todo: Partial<Todo> | unknown): todo is Todo {
  const validStatuses: TodoStatus[] = ['todo', 'in-progress', 'done'];
  const validPriorities: PriorityLevel[] = ['high', 'medium', 'low', 'none'];

  try {
    return (
      typeof todo === 'object' &&
      todo !== null &&
      typeof (todo as Todo).id === 'string' &&
      typeof (todo as Todo).title === 'string' &&
      (!(todo as Todo).description || typeof (todo as Todo).description === 'string') &&
      validStatuses.includes((todo as Todo).status) &&
      validPriorities.includes((todo as Todo).priority) &&
      typeof (todo as Todo).timeSpent === 'number' &&
      (todo as Todo).timeSpent >= 0 &&
      Array.isArray((todo as Todo).timeLog) &&
      !isNaN(new Date((todo as Todo).createdAt).getTime())
    );
  } catch {
    return false;
  }
} 