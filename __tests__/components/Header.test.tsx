import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '@/components/header'
import { useTodoStore } from '@/lib/store'
import { State, Actions } from '@/types/todo'

// Mock the store
jest.mock('@/lib/store', () => ({
  useTodoStore: jest.fn<Partial<State & Actions>, []>()
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id'
}))

// Mock theme provider
jest.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn()
  })
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <div data-testid="theme-provider">
      {ui}
    </div>
  )
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTodoStore as jest.MockedFunction<typeof useTodoStore>).mockReturnValue({
      addTodo: jest.fn(),
      todos: []
    })
  })

  it('renders logo and title', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('TaskVine')).toBeInTheDocument()
  })

  it('calls onAddTodo when add button is clicked', () => {
    const mockAddTodo = jest.fn()
    renderWithProviders(<Header onAddTodo={mockAddTodo} />)
    
    fireEvent.click(screen.getByText(/add.*todo/i))
    expect(mockAddTodo).toHaveBeenCalled()
  })
}) 