import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PillButton } from '../../shared/components/ui/PillButton'
import { renderWithProviders } from '../utils'

describe('PillButton', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      renderWithProviders(<PillButton>Click Me</PillButton>)

      expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('should render as a button element', () => {
      renderWithProviders(<PillButton>Button</PillButton>)

      expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('should render default variant', () => {
      renderWithProviders(<PillButton variant="default">Default</PillButton>)

      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    it('should render primary variant', () => {
      renderWithProviders(<PillButton variant="primary">Primary</PillButton>)

      expect(screen.getByText('Primary')).toBeInTheDocument()
    })

    it('should render warning variant', () => {
      renderWithProviders(<PillButton variant="warning">Warning</PillButton>)

      expect(screen.getByText('Warning')).toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    it('should render xs size', () => {
      renderWithProviders(<PillButton size="xs">XS Button</PillButton>)

      expect(screen.getByText('XS Button')).toBeInTheDocument()
    })

    it('should render sm size', () => {
      renderWithProviders(<PillButton size="sm">SM Button</PillButton>)

      expect(screen.getByText('SM Button')).toBeInTheDocument()
    })

    it('should render md size', () => {
      renderWithProviders(<PillButton size="md">MD Button</PillButton>)

      expect(screen.getByText('MD Button')).toBeInTheDocument()
    })
  })

  describe('icon', () => {
    it('should render icon on the right by default', () => {
      const icon = <span data-testid="icon">→</span>
      renderWithProviders(<PillButton icon={icon}>With Icon</PillButton>)

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('should render icon on the left when specified', () => {
      const icon = <span data-testid="icon">←</span>
      renderWithProviders(
        <PillButton icon={icon} iconPosition="left">
          With Left Icon
        </PillButton>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProviders(<PillButton disabled>Disabled</PillButton>)

      const button = screen.getByRole('button', { name: 'Disabled' })
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      renderWithProviders(
        <PillButton disabled onClick={onClick}>
          Disabled
        </PillButton>
      )

      await user.click(screen.getByText('Disabled'))

      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('loading state', () => {
    it('should show spinner when loading', () => {
      renderWithProviders(<PillButton isLoading>Loading</PillButton>)

      // Should not show the text when loading
      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
    })

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      renderWithProviders(
        <PillButton isLoading onClick={onClick}>
          Loading
        </PillButton>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('interaction', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      renderWithProviders(<PillButton onClick={onClick}>Click Me</PillButton>)

      await user.click(screen.getByText('Click Me'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should pass event to onClick handler', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      renderWithProviders(<PillButton onClick={onClick}>Click Me</PillButton>)

      await user.click(screen.getByText('Click Me'))

      expect(onClick).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('accessibility', () => {
    it('should have aria-label when provided', () => {
      renderWithProviders(<PillButton ariaLabel="Custom label">Button</PillButton>)

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label')
    })

    it('should have title when provided', () => {
      renderWithProviders(<PillButton title="Button title">Button</PillButton>)

      expect(screen.getByRole('button')).toHaveAttribute('title', 'Button title')
    })
  })

  describe('fullWidth', () => {
    it('should render full width when fullWidth is true', () => {
      renderWithProviders(<PillButton fullWidth>Full Width</PillButton>)

      const button = screen.getByRole('button', { name: 'Full Width' })
      expect(button).toHaveStyle({ width: '100%' })
    })
  })
})
