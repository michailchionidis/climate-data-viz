import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { InsightCard } from '../../features/ai/components/InsightCard'
import { renderWithProviders } from '../utils'
import type { AIInsight } from '../../shared/types'

const mockInsight: AIInsight = {
  type: 'trend',
  title: 'Temperature Trend Analysis',
  description: 'The average temperature has increased by 1.5°C over the past 50 years.',
  related_stations: ['101234', '66062'],
  confidence: 0.85,
}

describe('InsightCard', () => {
  describe('rendering', () => {
    it('should render insight title', () => {
      renderWithProviders(<InsightCard insight={mockInsight} index={0} />)

      expect(screen.getByText('Temperature Trend Analysis')).toBeInTheDocument()
    })

    it('should render insight description', () => {
      renderWithProviders(<InsightCard insight={mockInsight} index={0} />)

      expect(screen.getByText(/The average temperature has increased/)).toBeInTheDocument()
    })

    it('should render related stations', () => {
      renderWithProviders(<InsightCard insight={mockInsight} index={0} />)

      expect(screen.getByText('101234')).toBeInTheDocument()
      expect(screen.getByText('66062')).toBeInTheDocument()
    })

    it('should render confidence percentage', () => {
      renderWithProviders(<InsightCard insight={mockInsight} index={0} />)

      expect(screen.getByText('85% confidence')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have article role', () => {
      renderWithProviders(<InsightCard insight={mockInsight} index={0} />)

      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('should have aria-label with insight title', () => {
      renderWithProviders(<InsightCard insight={mockInsight} index={0} />)

      expect(screen.getByRole('article')).toHaveAttribute(
        'aria-label',
        'Insight 1: Temperature Trend Analysis'
      )
    })

    it('should have correct aria-label for different indices', () => {
      renderWithProviders(<InsightCard insight={mockInsight} index={2} />)

      expect(screen.getByRole('article')).toHaveAttribute(
        'aria-label',
        'Insight 3: Temperature Trend Analysis'
      )
    })
  })

  describe('with no related stations', () => {
    it('should render without station separator', () => {
      const insightWithoutStations: AIInsight = {
        ...mockInsight,
        related_stations: [],
      }

      renderWithProviders(<InsightCard insight={insightWithoutStations} index={0} />)

      expect(screen.getByText('85% confidence')).toBeInTheDocument()
      // Should not have separator dot
      expect(screen.queryByText('•')).not.toBeInTheDocument()
    })
  })

  describe('different confidence levels', () => {
    it('should render low confidence', () => {
      const lowConfidenceInsight: AIInsight = {
        ...mockInsight,
        confidence: 0.45,
      }

      renderWithProviders(<InsightCard insight={lowConfidenceInsight} index={0} />)

      expect(screen.getByText('45% confidence')).toBeInTheDocument()
    })

    it('should render high confidence', () => {
      const highConfidenceInsight: AIInsight = {
        ...mockInsight,
        confidence: 0.98,
      }

      renderWithProviders(<InsightCard insight={highConfidenceInsight} index={0} />)

      expect(screen.getByText('98% confidence')).toBeInTheDocument()
    })

    it('should round confidence correctly', () => {
      const fractionalConfidenceInsight: AIInsight = {
        ...mockInsight,
        confidence: 0.876,
      }

      renderWithProviders(<InsightCard insight={fractionalConfidenceInsight} index={0} />)

      expect(screen.getByText('88% confidence')).toBeInTheDocument()
    })
  })

  describe('different insight types', () => {
    it('should render trend type insight', () => {
      const trendInsight: AIInsight = {
        ...mockInsight,
        type: 'trend',
        title: 'Rising Temperatures',
      }

      renderWithProviders(<InsightCard insight={trendInsight} index={0} />)

      expect(screen.getByText('Rising Temperatures')).toBeInTheDocument()
    })

    it('should render anomaly type insight', () => {
      const anomalyInsight: AIInsight = {
        ...mockInsight,
        type: 'anomaly',
        title: 'Unusual Temperature Spike',
      }

      renderWithProviders(<InsightCard insight={anomalyInsight} index={0} />)

      expect(screen.getByText('Unusual Temperature Spike')).toBeInTheDocument()
    })

    it('should render comparison type insight', () => {
      const comparisonInsight: AIInsight = {
        ...mockInsight,
        type: 'comparison',
        title: 'Station Comparison',
      }

      renderWithProviders(<InsightCard insight={comparisonInsight} index={0} />)

      expect(screen.getByText('Station Comparison')).toBeInTheDocument()
    })
  })
})
