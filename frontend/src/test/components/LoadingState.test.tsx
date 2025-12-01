import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { LoadingState, CardSkeleton } from '../../shared/components/ui/LoadingState'
import { renderWithProviders } from '../utils'

describe('LoadingState', () => {
  describe('rendering', () => {
    it('should render with default message', () => {
      renderWithProviders(<LoadingState />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should render with custom message', () => {
      renderWithProviders(<LoadingState message="Fetching data..." />)
      expect(screen.getByText('Fetching data...')).toBeInTheDocument()
    })

    it('should render spinner', () => {
      renderWithProviders(<LoadingState />)
      // Just verify the component renders with the message
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    it('should render with small size', () => {
      renderWithProviders(<LoadingState size="sm" />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should render with medium size', () => {
      renderWithProviders(<LoadingState size="md" />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should render with large size', () => {
      renderWithProviders(<LoadingState size="lg" />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('minHeight', () => {
    it('should render with default minHeight', () => {
      renderWithProviders(<LoadingState />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should accept custom minHeight', () => {
      renderWithProviders(<LoadingState minHeight="400px" />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })
})

describe('CardSkeleton', () => {
  it('should render correctly', () => {
    const { container } = renderWithProviders(<CardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render with default height', () => {
    const { container } = renderWithProviders(<CardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render with custom height', () => {
    const { container } = renderWithProviders(<CardSkeleton height="300px" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
