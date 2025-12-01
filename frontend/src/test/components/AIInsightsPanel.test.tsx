import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AIInsightsPanel } from '../../features/ai/components/AIInsightsPanel'
import { renderWithProviders } from '../utils'

// Mock the useAI hook
const mockGenerateInsights = vi.fn()
const mockUseAI = vi.fn()

vi.mock('../../features/ai/hooks/useAIInsights', () => ({
  useAI: () => mockUseAI(),
}))

describe('AIInsightsPanel', () => {
  const defaultProps = {
    stations: ['101234'],
    yearFrom: 1950 as number | null,
    yearTo: 2019 as number | null,
    onOpenChat: vi.fn(),
    onExpandChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAI.mockReturnValue({
      insights: null,
      isGeneratingInsights: false,
      insightsError: null,
      generateInsights: mockGenerateInsights,
      hasInsights: false,
    })
  })

  describe('rendering', () => {
    it('should render the panel header', () => {
      renderWithProviders(<AIInsightsPanel {...defaultProps} />)

      expect(screen.getByText('AI Insights')).toBeInTheDocument()
    })

    it('should render Generate button', () => {
      renderWithProviders(<AIInsightsPanel {...defaultProps} />)

      expect(screen.getByRole('button', { name: /Generate/i })).toBeInTheDocument()
    })
  })

  describe('no stations selected', () => {
    it('should disable buttons when no stations selected', () => {
      renderWithProviders(<AIInsightsPanel {...defaultProps} stations={[]} />)

      expect(screen.getByRole('button', { name: /Generate/i })).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('generate insights', () => {
    it('should call generateInsights when Generate button is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<AIInsightsPanel {...defaultProps} />)

      await user.click(screen.getByRole('button', { name: /Generate/i }))

      expect(mockGenerateInsights).toHaveBeenCalled()
    })
  })

  describe('expand/collapse', () => {
    it('should toggle expanded state when header is clicked', async () => {
      const user = userEvent.setup()
      const onExpandChange = vi.fn()

      renderWithProviders(
        <AIInsightsPanel {...defaultProps} onExpandChange={onExpandChange} />
      )

      // Click header to expand
      await user.click(screen.getByText('AI Insights'))

      expect(onExpandChange).toHaveBeenCalledWith(true)
    })
  })

  describe('empty state', () => {
    it('should show empty state when no insights generated', () => {
      mockUseAI.mockReturnValue({
        insights: null,
        isGeneratingInsights: false,
        insightsError: null,
        generateInsights: mockGenerateInsights,
        hasInsights: false,
      })

      renderWithProviders(<AIInsightsPanel {...defaultProps} />)

      // Click to expand
      fireEvent.click(screen.getByText('AI Insights'))

      expect(screen.getByText(/Get AI-powered insights/i)).toBeInTheDocument()
    })
  })
})
