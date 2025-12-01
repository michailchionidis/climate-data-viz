import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { SectionHeader } from '../../shared/components/ui/SectionHeader'
import { renderWithProviders } from '../utils'

describe('SectionHeader', () => {
  describe('rendering', () => {
    it('should render the title', () => {
      renderWithProviders(<SectionHeader title="Test Title" />)

      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('should render with badge', () => {
      renderWithProviders(<SectionHeader title="Title" badge="5" />)

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render with numeric badge', () => {
      renderWithProviders(<SectionHeader title="Title" badge={10} />)

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should render action when provided', () => {
      renderWithProviders(
        <SectionHeader
          title="Title"
          action={<button>Action</button>}
        />
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('badge colors', () => {
    it('should render with cyan badge color', () => {
      renderWithProviders(
        <SectionHeader title="Title" badge="5" badgeColor="cyan" />
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render with orange badge color', () => {
      renderWithProviders(
        <SectionHeader title="Title" badge="5" badgeColor="orange" />
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render with green badge color', () => {
      renderWithProviders(
        <SectionHeader title="Title" badge="5" badgeColor="green" />
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render with purple badge color', () => {
      renderWithProviders(
        <SectionHeader title="Title" badge="5" badgeColor="purple" />
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      renderWithProviders(<SectionHeader title="Compact Title" compact />)

      expect(screen.getByText('Compact Title')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply uppercase transform to title', () => {
      renderWithProviders(<SectionHeader title="test title" />)

      const title = screen.getByText('test title')
      expect(title).toHaveStyle({ textTransform: 'uppercase' })
    })
  })
})
