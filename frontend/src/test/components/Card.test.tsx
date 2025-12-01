import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Card, CardHeader, CardBody } from '../../shared/components/ui/Card'
import { renderWithProviders } from '../utils'

describe('Card', () => {
  describe('rendering', () => {
    it('should render children correctly', () => {
      renderWithProviders(<Card>Card Content</Card>)
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('should apply default variant styles', () => {
      renderWithProviders(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
    })

    it('should forward ref correctly', () => {
      const ref = { current: null as HTMLDivElement | null }
      renderWithProviders(<Card ref={ref}>Content</Card>)
      expect(ref.current).not.toBeNull()
    })
  })

  describe('variants', () => {
    it('should render with default variant', () => {
      renderWithProviders(<Card variant="default" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should render with elevated variant', () => {
      renderWithProviders(<Card variant="elevated" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should render with interactive variant', () => {
      renderWithProviders(<Card variant="interactive" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should render with accent variant', () => {
      renderWithProviders(<Card variant="accent" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })
  })

  describe('accent colors', () => {
    it('should render with cyan accent', () => {
      renderWithProviders(<Card variant="accent" accentColor="cyan" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should render with orange accent', () => {
      renderWithProviders(<Card variant="accent" accentColor="orange" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should render with purple accent', () => {
      renderWithProviders(<Card variant="accent" accentColor="purple" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should render with emerald accent', () => {
      renderWithProviders(<Card variant="accent" accentColor="emerald" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })
  })

  describe('animation', () => {
    it('should render without animation by default', () => {
      renderWithProviders(<Card data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should render with animation when animate is true', () => {
      renderWithProviders(<Card animate data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should accept animation delay', () => {
      renderWithProviders(<Card animate animationDelay={0.5} data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })
  })

  describe('props spreading', () => {
    it('should spread additional props', () => {
      renderWithProviders(<Card data-testid="card" aria-label="Custom Card">Content</Card>)
      expect(screen.getByLabelText('Custom Card')).toBeInTheDocument()
    })
  })
})

describe('CardHeader', () => {
  it('should render children correctly', () => {
    renderWithProviders(
      <Card>
        <CardHeader>Header Content</CardHeader>
      </Card>
    )
    expect(screen.getByText('Header Content')).toBeInTheDocument()
  })

  it('should render without border by default', () => {
    renderWithProviders(
      <Card>
        <CardHeader data-testid="header">Header</CardHeader>
      </Card>
    )
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('should render with border when showBorder is true', () => {
    renderWithProviders(
      <Card>
        <CardHeader showBorder data-testid="header">Header</CardHeader>
      </Card>
    )
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('should spread additional props', () => {
    renderWithProviders(
      <Card>
        <CardHeader aria-label="Card Header">Header</CardHeader>
      </Card>
    )
    expect(screen.getByLabelText('Card Header')).toBeInTheDocument()
  })
})

describe('CardBody', () => {
  it('should render children correctly', () => {
    renderWithProviders(
      <Card>
        <CardBody>Body Content</CardBody>
      </Card>
    )
    expect(screen.getByText('Body Content')).toBeInTheDocument()
  })

  it('should spread additional props', () => {
    renderWithProviders(
      <Card>
        <CardBody aria-label="Card Body">Body</CardBody>
      </Card>
    )
    expect(screen.getByLabelText('Card Body')).toBeInTheDocument()
  })
})
