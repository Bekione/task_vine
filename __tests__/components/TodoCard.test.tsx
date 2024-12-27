import { render, screen } from '@testing-library/react'
import { TodoCard } from '@/components/todo-card'
import { Todo } from '@/types/todo'

describe('TodoCard', () => {
  const mockTodo: Todo = {
    id: "ffdsEuE15NXlB1rMnIqXI",
    title: "Build TaskVine App",
    description: "Develop a simple and sleek task management app.",
    status: "done",
    priority: "high",
    timeSpent: 300,
    createdAt: new Date(),
    timeLog: []
  }

  it('renders todo title and description', () => {
    render(<TodoCard todo={mockTodo} />)
    expect(screen.getByText('Build TaskVine App')).toBeInTheDocument()
    expect(screen.getByText('Develop a simple and sleek task management app.')).toBeInTheDocument()
  })
}) 