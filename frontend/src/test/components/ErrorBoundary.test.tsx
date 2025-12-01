import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary, ErrorDisplay } from '../../components/ErrorBoundary'
import { renderWithProviders } from '../utils'

// Component that throws an error
function ErrorThrowingComponent(): never {
  throw new Error('Test error')
}

// Component that works normally
function WorkingComponent() {
  return <div>Working content</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('should render children when no error', () => {
      renderWithProviders(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Working content')).toBeInTheDocument()
    })

    it('should render error UI when child throws', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should render custom fallback when provided', () => {
      renderWithProviders(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom fallback')).toBeInTheDocument()
    })
  })

  describe('error recovery', () => {
    it('should render Try Again button', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
    })
  })
})

describe('ErrorDisplay', () => {
  describe('rendering', () => {
    it('should render error message from Error object', () => {
      renderWithProviders(
        <ErrorDisplay error={new Error('Test error message')} />
      )

      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('should render error message from string', () => {
      renderWithProviders(
        <ErrorDisplay error="String error message" />
      )

      expect(screen.getByText('String error message')).toBeInTheDocument()
    })

    it('should render default title', () => {
      renderWithProviders(
        <ErrorDisplay error="Error" />
      )

      expect(screen.getByText('Error loading data')).toBeInTheDocument()
    })

    it('should render custom title', () => {
      renderWithProviders(
        <ErrorDisplay error="Error" title="Custom Title" />
      )

      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })
  })

  describe('retry button', () => {
    it('should not render retry button when onRetry is not provided', () => {
      renderWithProviders(
        <ErrorDisplay error="Error" />
      )

      expect(screen.queryByRole('button', { name: /Retry/i })).not.toBeInTheDocument()
    })

    it('should render retry button when onRetry is provided', () => {
      renderWithProviders(
        <ErrorDisplay error="Error" onRetry={() => {}} />
      )

      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument()
    })

    it('should call onRetry when retry button is clicked', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()

      renderWithProviders(
        <ErrorDisplay error="Error" onRetry={onRetry} />
      )

      await user.click(screen.getByRole('button', { name: /Retry/i }))

      expect(onRetry).toHaveBeenCalled()
    })
  })
})
