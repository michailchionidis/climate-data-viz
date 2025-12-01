import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { StatCard, StatCardSkeleton } from '../../shared/components/ui/StatCard'
import { renderWithProviders } from '../utils'

describe('StatCard', () => {
  describe('rendering', () => {
    it('should render label and value', () => {
      renderWithProviders(<StatCard label="Temperature" value="25°C" />)

      expect(screen.getByText('Temperature')).toBeInTheDocument()
      expect(screen.getByText('25°C')).toBeInTheDocument()
    })

    it('should render with icon', () => {
      renderWithProviders(
        <StatCard
          label="Temperature"
          value="25°C"
          icon={<span data-testid="icon">🌡️</span>}
        />
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render subValue', () => {
      renderWithProviders(
        <StatCard label="Temperature" value="25°C" subValue="Average" />
      )

      expect(screen.getByText('Average')).toBeInTheDocument()
    })
  })

  describe('colors', () => {
    it('should render with cyan color by default', () => {
      renderWithProviders(<StatCard label="Test" value="100" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with orange color', () => {
      renderWithProviders(<StatCard label="Test" value="100" color="orange" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with blue color', () => {
      renderWithProviders(<StatCard label="Test" value="100" color="blue" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with green color', () => {
      renderWithProviders(<StatCard label="Test" value="100" color="green" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with purple color', () => {
      renderWithProviders(<StatCard label="Test" value="100" color="purple" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with red color', () => {
      renderWithProviders(<StatCard label="Test" value="100" color="red" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    it('should render with sm size', () => {
      renderWithProviders(<StatCard label="Test" value="100" size="sm" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with md size', () => {
      renderWithProviders(<StatCard label="Test" value="100" size="md" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with lg size', () => {
      renderWithProviders(<StatCard label="Test" value="100" size="lg" />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })
  })

  describe('trend', () => {
    it('should render up trend', () => {
      renderWithProviders(
        <StatCard label="Test" value="100" trend="up" trendValue="+5%" />
      )

      expect(screen.getByText('↑')).toBeInTheDocument()
      expect(screen.getByText('+5%')).toBeInTheDocument()
    })

    it('should render down trend', () => {
      renderWithProviders(
        <StatCard label="Test" value="100" trend="down" trendValue="-3%" />
      )

      expect(screen.getByText('↓')).toBeInTheDocument()
      expect(screen.getByText('-3%')).toBeInTheDocument()
    })

    it('should render neutral trend', () => {
      renderWithProviders(
        <StatCard label="Test" value="100" trend="neutral" trendValue="0%" />
      )

      expect(screen.getByText('→')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      renderWithProviders(<StatCard label="Test" value="100" compact />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render icon in compact mode', () => {
      renderWithProviders(
        <StatCard
          label="Test"
          value="100"
          compact
          icon={<span data-testid="icon">🌡️</span>}
        />
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render subValue in compact mode', () => {
      renderWithProviders(
        <StatCard label="Test" value="100" compact subValue="units" />
      )

      expect(screen.getByText('units')).toBeInTheDocument()
    })
  })

  describe('animation', () => {
    it('should render with animation', () => {
      renderWithProviders(<StatCard label="Test" value="100" animate />)

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render with animation delay', () => {
      renderWithProviders(
        <StatCard label="Test" value="100" animate animationDelay={0.5} />
      )

      expect(screen.getByText('100')).toBeInTheDocument()
    })
  })
})

describe('StatCardSkeleton', () => {
  describe('rendering', () => {
    it('should render skeleton', () => {
      const { container } = renderWithProviders(<StatCardSkeleton />)

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render with sm size', () => {
      const { container } = renderWithProviders(<StatCardSkeleton size="sm" />)

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render with lg size', () => {
      const { container } = renderWithProviders(<StatCardSkeleton size="lg" />)

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render in compact mode', () => {
      const { container } = renderWithProviders(<StatCardSkeleton compact />)

      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
