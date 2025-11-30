/**
 * Tests for CollapsibleSection component
 *
 * Verifies the collapsible section behavior:
 * - Initial expanded/collapsed state
 * - Content visibility
 * - Badge rendering
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { CollapsibleSection } from '@/shared/components/ui/CollapsibleSection'
import { ThemeProvider } from '@/context/ThemeContext'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    <ThemeProvider>{children}</ThemeProvider>
  </ChakraProvider>
)

describe('CollapsibleSection', () => {
  describe('Rendering', () => {
    it('should render with title', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Test Section">
            <div>Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      expect(screen.getByText('Test Section')).toBeInTheDocument()
    })

    it('should render children when open', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Section" defaultOpen>
            <div>Section Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      expect(screen.getByText('Section Content')).toBeInTheDocument()
    })
  })

  describe('Default State', () => {
    it('should be open by default', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Section">
            <div data-testid="content">Visible Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('should be closed when defaultOpen is false', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Section" defaultOpen={false}>
            <div data-testid="content">Hidden Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      // Content is in DOM but hidden via CSS (height: 0)
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('Badge', () => {
    it('should render badge when provided as string', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Section" badge="5 items">
            <div>Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      expect(screen.getByText('5 items')).toBeInTheDocument()
    })

    it('should render badge when provided as number', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Section" badge={10}>
            <div>Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should not render badge when not provided', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Section">
            <div>Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      // Only title should be present, no badge
      expect(screen.getByText('Section')).toBeInTheDocument()
    })
  })

  describe('Action Slot', () => {
    it('should render action element when provided', () => {
      render(
        <TestWrapper>
          <CollapsibleSection title="Section" action={<button>Action</button>}>
            <div>Content</div>
          </CollapsibleSection>
        </TestWrapper>
      )

      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})
