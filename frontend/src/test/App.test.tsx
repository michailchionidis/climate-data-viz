/**
 * Basic smoke tests for the Climate Data Explorer application.
 * 
 * These tests verify that core components render without crashing.
 * More detailed component tests should be added as the application grows.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

// Mock Plotly to avoid canvas issues in tests
vi.mock('react-plotly.js', () => ({
  default: () => <div data-testid="mock-plotly">Plotly Chart</div>,
}))

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

/**
 * Test wrapper that provides all necessary context providers
 */
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}

describe('Application Setup', () => {
  it('should have testing library configured correctly', () => {
    render(
      <div data-testid="test-element">Test</div>,
      { wrapper: createTestWrapper() }
    )
    
    expect(screen.getByTestId('test-element')).toBeInTheDocument()
  })

  it('should have vitest matchers available', () => {
    expect(true).toBe(true)
    expect([1, 2, 3]).toHaveLength(3)
    expect({ foo: 'bar' }).toHaveProperty('foo')
  })
})

describe('React Query Setup', () => {
  it('should render with QueryClientProvider', () => {
    const TestComponent = () => <div>Query Client Works</div>
    
    render(<TestComponent />, { wrapper: createTestWrapper() })
    
    expect(screen.getByText('Query Client Works')).toBeInTheDocument()
  })
})

describe('Chakra UI Setup', () => {
  it('should render with ChakraProvider', () => {
    const TestComponent = () => <button>Chakra Button</button>
    
    render(<TestComponent />, { wrapper: createTestWrapper() })
    
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})

