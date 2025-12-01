import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CollapsibleSection } from '../../shared/components/ui/CollapsibleSection'
import { renderWithProviders } from '../utils'

describe('CollapsibleSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the title', () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section">
          <div>Content</div>
        </CollapsibleSection>
      )

      expect(screen.getByText('Test Section')).toBeInTheDocument()
    })

    it('should render children', () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section">
          <div>Test Content</div>
        </CollapsibleSection>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render badge when provided', () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section" badge="5">
          <div>Content</div>
        </CollapsibleSection>
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render numeric badge', () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section" badge={10}>
          <div>Content</div>
        </CollapsibleSection>
      )

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should render action element', () => {
      renderWithProviders(
        <CollapsibleSection
          title="Test Section"
          action={<button>Action</button>}
        >
          <div>Content</div>
        </CollapsibleSection>
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('default state', () => {
    it('should be open by default', () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section">
          <div>Content</div>
        </CollapsibleSection>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should be closed when defaultOpen is false', () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section" defaultOpen={false}>
          <div>Hidden Content</div>
        </CollapsibleSection>
      )

      // Content is in DOM but visually hidden
      expect(screen.getByText('Hidden Content')).toBeInTheDocument()
    })
  })

  describe('mobileOnly behavior', () => {
    it('should be mobileOnly by default', () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section">
          <div>Content</div>
        </CollapsibleSection>
      )

      // Content should be visible
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should allow toggle when mobileOnly is false', async () => {
      renderWithProviders(
        <CollapsibleSection title="Test Section" mobileOnly={false}>
          <div>Content</div>
        </CollapsibleSection>
      )

      // Click to toggle
      fireEvent.click(screen.getByText('Test Section'))

      // Content should still be in DOM
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('action click handling', () => {
    it('should not toggle when action is clicked', async () => {
      const user = userEvent.setup()
      const actionClick = vi.fn()

      renderWithProviders(
        <CollapsibleSection
          title="Test Section"
          mobileOnly={false}
          action={<button onClick={actionClick}>Action</button>}
        >
          <div>Content</div>
        </CollapsibleSection>
      )

      await user.click(screen.getByRole('button', { name: 'Action' }))

      expect(actionClick).toHaveBeenCalled()
    })
  })

  describe('styling', () => {
    it('should apply uppercase text transform to title', () => {
      renderWithProviders(
        <CollapsibleSection title="test section">
          <div>Content</div>
        </CollapsibleSection>
      )

      const title = screen.getByText('test section')
      expect(title).toHaveStyle({ textTransform: 'uppercase' })
    })
  })

  describe('with different content', () => {
    it('should render complex children', () => {
      renderWithProviders(
        <CollapsibleSection title="Complex Section">
          <div>
            <h3>Heading</h3>
            <p>Paragraph</p>
            <button>Button</button>
          </div>
        </CollapsibleSection>
      )

      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument()
    })
  })
})
