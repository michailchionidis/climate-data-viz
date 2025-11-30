/**
 * Tests for PillButton component
 *
 * Verifies the pill-shaped button component:
 * - Rendering with different variants
 * - Size variations
 * - Disabled state
 * - Click handling
 * - Full width mode
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { PillButton } from '@/shared/components/ui/PillButton'
import { ThemeProvider } from '@/context/ThemeContext'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    <ThemeProvider>{children}</ThemeProvider>
  </ChakraProvider>
)

describe('PillButton', () => {
  describe('Rendering', () => {
    it('should render with children text', () => {
      render(
        <TestWrapper>
          <PillButton>Click Me</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('should render as a button element', () => {
      render(
        <TestWrapper>
          <PillButton>Button</PillButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      render(
        <TestWrapper>
          <PillButton variant="default">Default</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    it('should render primary variant', () => {
      render(
        <TestWrapper>
          <PillButton variant="primary">Primary</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Primary')).toBeInTheDocument()
    })

    it('should render warning variant', () => {
      render(
        <TestWrapper>
          <PillButton variant="warning">Warning</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Warning')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should render xs size', () => {
      render(
        <TestWrapper>
          <PillButton size="xs">Extra Small</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Extra Small')).toBeInTheDocument()
    })

    it('should render sm size', () => {
      render(
        <TestWrapper>
          <PillButton size="sm">Small</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Small')).toBeInTheDocument()
    })

    it('should render md size', () => {
      render(
        <TestWrapper>
          <PillButton size="md">Medium</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Medium')).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn()

      render(
        <TestWrapper>
          <PillButton onClick={handleClick}>Click Me</PillButton>
        </TestWrapper>
      )

      fireEvent.click(screen.getByText('Click Me'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn()

      render(
        <TestWrapper>
          <PillButton onClick={handleClick} disabled>
            Disabled
          </PillButton>
        </TestWrapper>
      )

      fireEvent.click(screen.getByText('Disabled'))

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('should have aria-disabled when disabled', () => {
      render(
        <TestWrapper>
          <PillButton disabled>Disabled Button</PillButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
    })

    it('should have aria-disabled false when enabled', () => {
      render(
        <TestWrapper>
          <PillButton>Enabled Button</PillButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false')
    })
  })

  describe('Full Width', () => {
    it('should render with full width when specified', () => {
      render(
        <TestWrapper>
          <PillButton fullWidth>Full Width</PillButton>
        </TestWrapper>
      )

      expect(screen.getByText('Full Width')).toBeInTheDocument()
    })
  })
})
