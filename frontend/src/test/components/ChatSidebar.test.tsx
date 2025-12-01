import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ChatSidebar } from '../../features/ai/components/ChatSidebar'
import { renderWithProviders } from '../utils'

// Mock the useAskGrok hook
vi.mock('../../features/ai/hooks/useAIInsights', () => ({
  useAskGrok: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

describe('ChatSidebar', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    stations: ['101234'],
    yearFrom: 1950 as number | null,
    yearTo: 2019 as number | null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render when open', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} />)

      expect(screen.getByRole('complementary')).toBeInTheDocument()
    })

    it('should render Grok header', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} />)

      expect(screen.getByText('Ask Grok')).toBeInTheDocument()
    })

    it('should render input field', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} />)

      expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument()
    })
  })

  describe('closed state', () => {
    it('should be hidden when closed', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} isOpen={false} />)

      const sidebar = screen.getByRole('complementary', { hidden: true })
      expect(sidebar).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('no stations selected', () => {
    it('should show placeholder when no stations selected', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} stations={[]} />)

      expect(screen.getByText(/Select stations first/i)).toBeInTheDocument()
    })

    it('should disable input when no stations selected', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} stations={[]} />)

      const input = screen.getByPlaceholderText(/Select stations first/i)
      expect(input).toBeDisabled()
    })
  })

  describe('empty state', () => {
    it('should show empty state when no messages', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} />)

      expect(screen.getByText(/Ask anything about your data/i)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on sidebar', () => {
      renderWithProviders(<ChatSidebar {...defaultProps} />)

      expect(screen.getByRole('complementary')).toHaveAttribute('aria-label', 'Grok AI Chat')
    })
  })
})
