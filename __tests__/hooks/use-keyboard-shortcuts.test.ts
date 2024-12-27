import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls router.push when Ctrl+K is pressed', () => {
    renderHook(() => useKeyboardShortcuts())
    
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true
    })
    window.dispatchEvent(event)

    expect(mockPush).toHaveBeenCalledWith('/?add-todo')
  })
}) 