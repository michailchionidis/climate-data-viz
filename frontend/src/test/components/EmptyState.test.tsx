import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { EmptyState } from '../../shared/components/ui/EmptyState'
import { renderWithProviders } from '../utils'
import { FiDatabase } from 'react-icons/fi'

describe('EmptyState', () => {
  describe('rendering', () => {
    it('should render title correctly', () => {
      renderWithProviders(<EmptyState title="No data available" />)
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('should render description when provided', () => {
      renderWithProviders(
        <EmptyState
          title="No data"
          description="Select a station to view data"
        />
      )
      expect(screen.getByText('Select a station to view data')).toBeInTheDocument()
    })

    it('should not render description when not provided', () => {
      renderWithProviders(<EmptyState title="No data" />)
      expect(screen.queryByText('Select a station')).not.toBeInTheDocument()
    })

    it('should render icon when provided', () => {
      renderWithProviders(
        <EmptyState
          title="No data"
          icon={<FiDatabase data-testid="icon" />}
        />
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should not render icon when not provided', () => {
      renderWithProviders(<EmptyState title="No data" />)
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    })
  })

  describe('action', () => {
    it('should render action when provided', () => {
      renderWithProviders(
        <EmptyState
          title="No data"
          action={<button>Load Data</button>}
        />
      )
      expect(screen.getByRole('button', { name: 'Load Data' })).toBeInTheDocument()
    })

    it('should not render action when not provided', () => {
      renderWithProviders(<EmptyState title="No data" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      renderWithProviders(
        <EmptyState
          title="No data"
          compact
        />
      )
      expect(screen.getByText('No data')).toBeInTheDocument()
    })

    it('should not render description in compact mode', () => {
      renderWithProviders(
        <EmptyState
          title="No data"
          description="This should not appear"
          compact
        />
      )
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument()
    })
  })

  describe('minHeight', () => {
    it('should render with default minHeight', () => {
      renderWithProviders(<EmptyState title="No data" />)
      expect(screen.getByText('No data')).toBeInTheDocument()
    })

    it('should accept custom minHeight', () => {
      renderWithProviders(<EmptyState title="No data" minHeight="400px" />)
      expect(screen.getByText('No data')).toBeInTheDocument()
    })
  })
})
